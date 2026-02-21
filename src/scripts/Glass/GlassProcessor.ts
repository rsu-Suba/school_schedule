import { spineFC, ringFC } from "@/scripts/Glass/GlassFC";

const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
    }
`;

const fragmentShaderSource = `
    precision highp float;

    uniform sampler2D u_sourceTexture;
    uniform vec2 u_sourceSize;
    uniform vec2 u_canvasSize;
    uniform vec2 u_offset;

    uniform vec2 u_spineStart;
    uniform vec2 u_spineEnd;
    uniform vec2 u_spineMid;
    uniform float u_invHalfSpineLength;

    uniform float u_innerRadiusSq;
    uniform float u_radiusSq;
    uniform float u_invRingThickness;
    uniform float u_invInnerBlurWidth;
    uniform float u_innerRadius;
    uniform float u_reflectMinRadius;

    uniform float u_innerBlurWidth;
    uniform float u_compressionPower;

    varying vec2 v_texCoord;

    void main() {
        float maxAberration = 0.4;
        float maxSpineDistortion = 15.0;

        float x = v_texCoord.x * u_canvasSize.x;
        float y = (1.0 - v_texCoord.y) * u_canvasSize.y;

        float cy = clamp(y, u_spineStart.y, u_spineEnd.y);
        float cx = clamp(x, u_spineStart.x, u_spineEnd.x);
        float dx = x - cx;
        float dy = y - cy;
        float distSq = dx * dx + dy * dy;

        float globalX_orig = x + u_offset.x;
        float globalY_orig = y + u_offset.y;
        vec2 uv_orig = vec2(globalX_orig / u_sourceSize.x, 1.0 - (globalY_orig / u_sourceSize.y));
        vec3 finalRGB = texture2D(u_sourceTexture, uv_orig).rgb;

        if (distSq > u_innerRadiusSq && distSq <= u_radiusSq) {
            float distance = sqrt(distSq);

            float ratioInRing = (distance - u_innerRadius) * u_invRingThickness;
            float compressedRatio = pow(ratioInRing, u_compressionPower);
            float newDistance = u_innerRadius - compressedRatio * (u_innerRadius - u_reflectMinRadius);

            float ratio = newDistance / distance;
            float baseDX = dx * ratio;
            float baseDY = dy * ratio;

            float dxMid = cx - u_spineMid.x;
            float dyMid = cy - u_spineMid.y;
            float spineRatioX = dxMid * u_invHalfSpineLength;
            float spineRatioY = dyMid * u_invHalfSpineLength;
            float spineForce = -maxSpineDistortion * pow(ratioInRing, 3.0);
            float spineShiftX = spineRatioX * abs(spineRatioX) * spineForce;
            float spineShiftY = spineRatioY * abs(spineRatioY) * spineForce;

            float finalBaseDX = baseDX + spineShiftX;
            float finalBaseDY = baseDY + spineShiftY;
            float aberForce = maxAberration * pow(ratioInRing, 4.0);
            float shiftX = finalBaseDY * aberForce;
            float shiftY = finalBaseDX * aberForce;

            float srcXR = cx + finalBaseDX - shiftX + 0.5;
            float srcYR = cy + finalBaseDY + shiftY + 0.5;
            float srcXG = cx + finalBaseDX + 0.5;
            float srcYG = cy + finalBaseDY + 0.5;
            float srcXB = cx + finalBaseDX + shiftX + 0.5;
            float srcYB = cy + finalBaseDY - shiftY + 0.5;

            bool inBounds = (srcXG >= 0.0 && srcXG < u_canvasSize.x && srcYG >= 0.0 && srcYG < u_canvasSize.y);
            
            if (inBounds) {
                vec2 uvR = vec2((srcXR + u_offset.x) / u_sourceSize.x, 1.0 - ((srcYR + u_offset.y) / u_sourceSize.y));
                vec2 uvG = vec2((srcXG + u_offset.x) / u_sourceSize.x, 1.0 - ((srcYG + u_offset.y) / u_sourceSize.y));
                vec2 uvB = vec2((srcXB + u_offset.x) / u_sourceSize.x, 1.0 - ((srcYB + u_offset.y) / u_sourceSize.y));

                float r = texture2D(u_sourceTexture, uvR).r;
                float g = texture2D(u_sourceTexture, uvG).g;
                float b = texture2D(u_sourceTexture, uvB).b;

                if (distance < u_innerRadius + u_innerBlurWidth) {
                    float t = (distance - u_innerRadius) * u_invInnerBlurWidth;
                    t = t * t * (3.0 - 2.0 * t);
                    
                    finalRGB.r = mix(finalRGB.r, r, t);
                    finalRGB.g = mix(finalRGB.g, g, t);
                    finalRGB.b = mix(finalRGB.b, b, t);
                } else {
                    finalRGB = vec3(r, g, b);
                }
            }
        }

        gl_FragColor = vec4(finalRGB, 1.0);
    }
`;

export class GlassRenderer {
    private gl: WebGLRenderingContext;
    private locs: Record<string, WebGLUniformLocation> = {};
    private texture: WebGLTexture;
    private lastSourceCanvas: HTMLCanvasElement | null = null;

    constructor() {
        const offscreenCanvas = document.createElement("canvas");
        const gl = (offscreenCanvas.getContext("webgl") || offscreenCanvas.getContext("experimental-webgl")) as WebGLRenderingContext;
        
        if (!gl) {
            throw new Error("WebGL is utterly not supported on this device.");
        }
        
        this.gl = gl;

        const compileShader = (type: number, source: string) => {
            const shader = gl.createShader(type)!;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const program = gl.createProgram()!;
        gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShaderSource));
        gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
        gl.linkProgram(program);
        gl.useProgram(program);

        const buffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1.0, -1.0,  1.0, -1.0,  -1.0,  1.0,
            -1.0,  1.0,  1.0, -1.0,   1.0,  1.0,
        ]), gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        this.texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const uniformNames = [
            "u_sourceTexture", "u_sourceSize", "u_canvasSize", "u_offset",
            "u_spineStart", "u_spineEnd", "u_spineMid", "u_invHalfSpineLength",
            "u_innerRadiusSq", "u_radiusSq", "u_invRingThickness", "u_invInnerBlurWidth",
            "u_innerRadius", "u_reflectMinRadius", "u_innerBlurWidth", "u_compressionPower"
        ];
        uniformNames.forEach(name => {
            this.locs[name] = gl.getUniformLocation(program, name)!;
        });
    }

    dispose() {
        if (this.gl) {
            const ext = this.gl.getExtension("WEBGL_lose_context");
            if (ext) ext.loseContext();
        }
    }

    render(params: {
        ctx: CanvasRenderingContext2D;
        sourceCanvas: HTMLCanvasElement;
        physicalWidth: number;
        physicalHeight: number;
        offsetX: number;
        offsetY: number;
        innerRatio?: number;
        innerBlurWidth?: number;
        compressionPower?: number;
    }) {
        const { gl, locs } = this;
        const { ctx, physicalWidth, physicalHeight, sourceCanvas, offsetX, offsetY, innerRatio = 0.56, innerBlurWidth = 0, compressionPower = 0 } = params;

        if (gl.canvas.width !== physicalWidth || gl.canvas.height !== physicalHeight) {
            gl.canvas.width = physicalWidth;
            gl.canvas.height = physicalHeight;
            gl.viewport(0, 0, physicalWidth, physicalHeight);
        }

        if (this.lastSourceCanvas !== sourceCanvas) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas);
            this.lastSourceCanvas = sourceCanvas;
        }

        const isHorizontal = physicalWidth >= physicalHeight;
        const radius = isHorizontal ? physicalHeight / 2 : physicalWidth / 2;
        const innerRadius = radius * innerRatio;

        const spine = spineFC(physicalWidth, physicalHeight);
        const ring = ringFC(spine.radius, innerRadius, innerBlurWidth);

        const spineMidX = (spine.Start.x + spine.End.x) * 0.5;
        const spineMidY = (spine.Start.y + spine.End.y) * 0.5;

        const dxSpine = spine.End.x - spine.Start.x;
        const dySpine = spine.End.y - spine.Start.y;
        const halfSpineLength = Math.sqrt(dxSpine * dxSpine + dySpine * dySpine) * 0.5;
        const invHalfSpineLength = halfSpineLength > 0 ? 1.0 / halfSpineLength : 0;

        gl.uniform2f(locs["u_sourceSize"], sourceCanvas.width, sourceCanvas.height);
        gl.uniform2f(locs["u_canvasSize"], physicalWidth, physicalHeight);
        gl.uniform2f(locs["u_offset"], offsetX, offsetY);

        gl.uniform2f(locs["u_spineStart"], spine.Start.x, spine.Start.y);
        gl.uniform2f(locs["u_spineEnd"], spine.End.x, spine.End.y);
        gl.uniform2f(locs["u_spineMid"], spineMidX, spineMidY);
        gl.uniform1f(locs["u_invHalfSpineLength"], invHalfSpineLength);

        gl.uniform1f(locs["u_innerRadiusSq"], ring.innerRadiusSq);
        gl.uniform1f(locs["u_radiusSq"], ring.radiusSq);
        gl.uniform1f(locs["u_invRingThickness"], ring.invRingThickness);
        gl.uniform1f(locs["u_invInnerBlurWidth"], ring.invInnerBlurWidth);
        gl.uniform1f(locs["u_innerRadius"], innerRadius);
        gl.uniform1f(locs["u_reflectMinRadius"], ring.reflectMinRadius);
        gl.uniform1f(locs["u_innerBlurWidth"], innerBlurWidth);
        gl.uniform1f(locs["u_compressionPower"], compressionPower);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        ctx.clearRect(0, 0, physicalWidth, physicalHeight);
        ctx.drawImage(gl.canvas, 0, 0);
    }
}