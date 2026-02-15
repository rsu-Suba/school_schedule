import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";

interface DOMPillLensProps {
    /** ガラス越しに見せたいDOM要素 */
    children: React.ReactNode;
    initialX?: number;
    initialY?: number;
    width?: number;
    height?: number;
    innerRatio?: number;
    innerBlurWidth?: number;
}

const InvertedCircleLens: React.FC<DOMPillLensProps> = ({
    children,
    initialX = 300,
    initialY = 200,
    width = 360,
    height = 120,
    innerRatio = 0.57,
    innerBlurWidth = 4,
}) => {
    // DOM参照用とCanvas描画用のRef
    const contentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // html2canvasでキャプチャした画像データと、コンテンツのサイズ
    const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // --- ① DOMをキャプチャして画像化する ---
    useEffect(() => {
        if (!contentRef.current) return;

        const captureDOM = async () => {
            try {
                // 対象のDOM要素をCanvas（画像）に変換
                const canvas = await html2canvas(contentRef.current!, {
                    backgroundColor: null, // 背景を透明に
                    scale: 1, // 等倍でキャプチャ（高解像度にしたい場合は2などを指定）
                    logging: false,
                });
                setSourceCanvas(canvas);
                setDimensions({ width: canvas.width, height: canvas.height });
            } catch (error) {
                console.error("DOMのキャプチャに失敗しました:", error);
            }
        };

        // DOMのレンダリングや画像の読み込みを待つために少し遅延させる
        const timer = setTimeout(() => captureDOM(), 200);
        return () => clearTimeout(timer);
    }, [children]); // childrenが変更されたら再キャプチャ

    // --- ② キャプチャした画像を使ってピル型レンズを描画する ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !sourceCanvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        // 背景としてキャプチャしたDOMを描画
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(sourceCanvas, 0, 0);

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
                            newData[destIndex]     = data[destIndex]     * (1 - t) + data[srcIndex]     * t;
                            newData[destIndex + 1] = data[destIndex + 1] * (1 - t) + data[srcIndex + 1] * t;
                            newData[destIndex + 2] = data[destIndex + 2] * (1 - t) + data[srcIndex + 2] * t;
                            newData[destIndex + 3] = data[destIndex + 3];
                        }
                    } else {
                        newData[destIndex]     = data[destIndex];
                        newData[destIndex + 1] = data[destIndex + 1];
                        newData[destIndex + 2] = data[destIndex + 2];
                        newData[destIndex + 3] = data[destIndex + 3];
                    }
                }
            }
            ctx.putImageData(new ImageData(newData, sizeX, sizeY), startX, startY);
        } catch (e) {
            // キャンバス外エラー無視
        }
    }, [pos, sourceCanvas, dimensions, width, height, innerRatio, innerBlurWidth]);

    // --- ③ マウスイベント（ピル形状の当たり判定） ---
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

        if (Math.sqrt((localX - cx)**2 + (localY - cy)**2) <= radius) {
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

    // --- ④ レンダリング ---
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* 背面に配置される、元のDOM要素（ここで画面を構成する） */}
            <div ref={contentRef} style={{ display: "inline-block" }}>
                {children}
            </div>

            {/* その上に重なる、レンズエフェクトを描画するCanvas */}
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: sourceCanvas ? "block" : "none", // キャプチャ完了まで隠す
                    cursor: isDragging ? "grabbing" : "default",
                    width: dimensions.width,
                    height: dimensions.height,
                }}
            />

            {/* 最前面のガラスのフチ（装飾レイヤー） */}
            {sourceCanvas && (
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
                        backdropFilter: "blur(1px) saturate(150%) brightness(110%)",
                    }}
                />
            )}
        </div>
    );
};

export default InvertedCircleLens;