import React, { useRef, useEffect, useState } from "react";

interface DraggablePillLensProps {
    imageUrl: string;
    initialX?: number;
    initialY?: number;
    width?: number;
    height?: number;
    innerRatio?: number;
    innerBlurWidth?: number;
    bgOffsetX?: number;
    bgOffsetY?: number;
    bgScale?: number;
    canvasWidth?: number;
    canvasHeight?: number;
}

const InvertedCircleLens: React.FC<DraggablePillLensProps> = ({
    imageUrl,
    initialX = 300,
    initialY = 300,
    width = 360,
    height = 120,
    innerRatio = 0.57,
    innerBlurWidth = 4,
    bgOffsetX = 0,
    bgOffsetY = 0,
    bgScale = 1.0,
    canvasWidth,
    canvasHeight,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        img.onload = () => setImageElement(img);
    }, [imageUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !imageElement) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const finalCanvasWidth = canvasWidth || imageElement.width * bgScale;
        const finalCanvasHeight = canvasHeight || imageElement.height * bgScale;
        canvas.width = finalCanvasWidth;
        canvas.height = finalCanvasHeight;

        ctx.clearRect(0, 0, finalCanvasWidth, finalCanvasHeight);
        ctx.drawImage(imageElement, bgOffsetX, bgOffsetY, imageElement.width * bgScale, imageElement.height * bgScale);

        const sizeX = width;
        const sizeY = height;
        const startX = Math.round(pos.x - width / 2);
        const startY = Math.round(pos.y - height / 2);

        try {
            const imageData = ctx.getImageData(startX, startY, sizeX, sizeY);
            const data = imageData.data;
            const newData = new Uint8ClampedArray(data.length);
            const isHorizontal = width >= height;
            const radius = isHorizontal ? height / 2 : width / 2;
            const spineStartX = isHorizontal ? radius : width / 2;
            const spineEndX = isHorizontal ? width - radius : width / 2;
            const spineStartY = isHorizontal ? height / 2 : radius;
            const spineEndY = isHorizontal ? height / 2 : height - radius;

            const innerRadius = radius * innerRatio;

            for (let y = 0; y < sizeY; y++) {
                for (let x = 0; x < sizeX; x++) {
                    const cx = Math.max(spineStartX, Math.min(x, spineEndX));
                    const cy = Math.max(spineStartY, Math.min(y, spineEndY));

                    const dx = x - cx;
                    const dy = y - cy;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const destIndex = (y * sizeX + x) * 4;

                    if (distance > innerRadius && distance <= radius) {
                        const reflectMinRadius = innerRadius * 0.2;
                        const ringThickness = radius - innerRadius;
                        const ratioInRing = (distance - innerRadius) / ringThickness;

                        const compressionPower = 2.5;
                        const compressedRatio = Math.pow(ratioInRing, compressionPower);
                        const newDistance = innerRadius - compressedRatio * (innerRadius - reflectMinRadius);

                        const angle = Math.atan2(dy, dx);
                        const srcX = Math.round(cx + Math.cos(angle) * newDistance);
                        const srcY = Math.round(cy + Math.sin(angle) * newDistance);

                        if (srcX >= 0 && srcX < sizeX && srcY >= 0 && srcY < sizeY) {
                            const srcIndex = (srcY * sizeX + srcX) * 4;

                            let t = 1.0;
                            if (distance < innerRadius + innerBlurWidth) {
                                t = (distance - innerRadius) / innerBlurWidth;
                                t = t * t * (3 - 2 * t);
                            }

                            newData[destIndex] = data[destIndex] * (1 - t) + data[srcIndex] * t;
                            newData[destIndex + 1] = data[destIndex + 1] * (1 - t) + data[srcIndex + 1] * t;
                            newData[destIndex + 2] = data[destIndex + 2] * (1 - t) + data[srcIndex + 2] * t;
                            newData[destIndex + 3] = data[destIndex + 3];
                        }
                    } else {
                        newData[destIndex] = data[destIndex];
                        newData[destIndex + 1] = data[destIndex + 1];
                        newData[destIndex + 2] = data[destIndex + 2];
                        newData[destIndex + 3] = data[destIndex + 3];
                    }
                }
            }

            ctx.putImageData(new ImageData(newData, sizeX, sizeY), startX, startY);
        } catch (e) {}
    }, [
        pos,
        imageElement,
        width,
        height,
        innerRatio,
        innerBlurWidth,
        bgOffsetX,
        bgOffsetY,
        bgScale,
        canvasWidth,
        canvasHeight,
    ]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const localX = mouseX - (pos.x - width / 2);
        const localY = mouseY - (pos.y - height / 2);

        const isHorizontal = width >= height;
        const radius = isHorizontal ? height / 2 : width / 2;
        const spineStartX = isHorizontal ? radius : width / 2;
        const spineEndX = isHorizontal ? width - radius : width / 2;
        const spineStartY = isHorizontal ? height / 2 : radius;
        const spineEndY = isHorizontal ? height / 2 : height - radius;

        const cx = Math.max(spineStartX, Math.min(localX, spineEndX));
        const cy = Math.max(spineStartY, Math.min(localY, spineEndY));

        const distance = Math.sqrt((localX - cx) ** 2 + (localY - cy) ** 2);

        if (distance <= radius) {
            setIsDragging(true);
            setDragOffset({ x: mouseX - pos.x, y: mouseY - pos.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setPos({ x: mouseX - dragOffset.x, y: mouseY - dragOffset.y });
    };

    const handleMouseUpOrLeave = () => setIsDragging(false);

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                style={{
                    display: "block",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    cursor: isDragging ? "grabbing" : "default",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: pos.y - height / 2,
                    left: pos.x - width / 2,
                    width: width,
                    height: height,
                    borderRadius: "9999px",
                    border: "3px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
                    pointerEvents: "none",
                    boxSizing: "border-box",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(0.2px) saturate(150%) brightness(110%)",
                }}
            />
        </div>
    );
};

export default InvertedCircleLens;
