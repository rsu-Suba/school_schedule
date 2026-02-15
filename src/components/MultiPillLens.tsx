import React, { useRef, useEffect, useState } from "react";

// 個別のレンズ（ピル）のデータを定義する型
export interface PillData {
    id: string; // レンズを識別するユニークなID
    x: number; // 中心のX座標
    y: number; // 中心のY座標
    width: number; // 横幅
    height: number; // 縦幅
}

interface MultiPillLensProps {
    imageUrl: string;
    // ★ 複数のレンズを配列で受け取れるように変更
    initialPills?: PillData[];
    innerRatio?: number;
    innerBlurWidth?: number;
    bgOffsetX?: number;
    bgOffsetY?: number;
    bgScale?: number;
    canvasWidth?: number;
    canvasHeight?: number;
}

const MultiPillLens: React.FC<MultiPillLensProps> = ({
    imageUrl,
    // デフォルトで2つのピルを配置
    initialPills = [
        { id: "pill-1", x: 300, y: 200, width: 360, height: 120 },
        { id: "pill-2", x: 400, y: 400, width: 150, height: 300 }, // 縦長も混ぜてみました
    ],
    innerRatio = 0.57,
    innerBlurWidth = 4,
    bgOffsetX = 0,
    bgOffsetY = 0,
    bgScale = 1.0,
    canvasWidth,
    canvasHeight,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ★ 状態管理を「配列」と「現在掴んでいるレンズのID」に変更
    const [pills, setPills] = useState<PillData[]>(initialPills);
    const [draggingId, setDraggingId] = useState<string | null>(null);
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

        // 1. まず背景画像を1回だけ描画
        ctx.clearRect(0, 0, finalCanvasWidth, finalCanvasHeight);
        ctx.drawImage(imageElement, bgOffsetX, bgOffsetY, imageElement.width * bgScale, imageElement.height * bgScale);

        // 2. ★ レンズの数だけピクセル操作を順番に実行（ループ）
        pills.forEach((pill) => {
            const sizeX = pill.width;
            const sizeY = pill.height;
            const startX = Math.round(pill.x - pill.width / 2);
            const startY = Math.round(pill.y - pill.height / 2);

            try {
                // 重なっている場合、すでに歪んだ後のピクセルを取得するため自然な複合レンズになる
                const imageData = ctx.getImageData(startX, startY, sizeX, sizeY);
                const data = imageData.data;
                const newData = new Uint8ClampedArray(data.length);

                const isHorizontal = pill.width >= pill.height;
                const radius = isHorizontal ? pill.height / 2 : pill.width / 2;

                const spineStartX = isHorizontal ? radius : pill.width / 2;
                const spineEndX = isHorizontal ? pill.width - radius : pill.width / 2;
                const spineStartY = isHorizontal ? pill.height / 2 : radius;
                const spineEndY = isHorizontal ? pill.height / 2 : pill.height - radius;

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
                // 加工した四角形をキャンバスに戻す
                ctx.putImageData(new ImageData(newData, sizeX, sizeY), startX, startY);
            } catch (e) {
                // 画面外エラー無視
            }
        }); // forEachここまで
    }, [pills, imageElement, innerRatio, innerBlurWidth, bgOffsetX, bgOffsetY, bgScale, canvasWidth, canvasHeight]);

    // --- マウスイベント処理 ---
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // ★ 配列を「後ろから」チェックする（上に重なっているレンズを優先して掴むため）
        for (let i = pills.length - 1; i >= 0; i--) {
            const pill = pills[i];
            const localX = mouseX - (pill.x - pill.width / 2);
            const localY = mouseY - (pill.y - pill.height / 2);

            const isHorizontal = pill.width >= pill.height;
            const radius = isHorizontal ? pill.height / 2 : pill.width / 2;
            const spineStartX = isHorizontal ? radius : pill.width / 2;
            const spineEndX = isHorizontal ? pill.width - radius : pill.width / 2;
            const spineStartY = isHorizontal ? pill.height / 2 : radius;
            const spineEndY = isHorizontal ? pill.height / 2 : pill.height - radius;

            const cx = Math.max(spineStartX, Math.min(localX, spineEndX));
            const cy = Math.max(spineStartY, Math.min(localY, spineEndY));

            const distance = Math.sqrt((localX - cx) ** 2 + (localY - cy) ** 2);

            if (distance <= radius) {
                setDraggingId(pill.id); // 掴んだレンズのIDを記録
                setDragOffset({ x: mouseX - pill.x, y: mouseY - pill.y });
                return; // 1つ見つけたらループ終了（下のレンズは掴まない）
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingId || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // ★ 掴んでいるIDのレンズだけ座標を更新する
        setPills((prevPills) =>
            prevPills.map((pill) =>
                pill.id === draggingId ? { ...pill, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y } : pill,
            ),
        );
    };

    const handleMouseUpOrLeave = () => setDraggingId(null);

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
                    cursor: draggingId ? "grabbing" : "default",
                }}
            />

            {/* ★ 装飾のCSSレイヤーも配列の数だけ生成する */}
            {pills.map((pill) => (
                <div
                    key={pill.id}
                    style={{
                        position: "absolute",
                        top: pill.y - pill.height / 2,
                        left: pill.x - pill.width / 2,
                        width: pill.width,
                        height: pill.height,
                        borderRadius: "9999px",
                        border: "3px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
                        pointerEvents: "none",
                        boxSizing: "border-box",
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(1px) saturate(150%) brightness(110%)",
                        // ドラッグ中のレンズを最前面（z-index）にする
                        zIndex: draggingId === pill.id ? 10 : 1,
                    }}
                />
            ))}
        </div>
    );
};

export default MultiPillLens;
