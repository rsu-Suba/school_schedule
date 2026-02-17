import React, { useRef, useEffect, useState } from "react";
import { processGlassRefraction } from "./GlassProcessor";

interface DraggablePillLensProps {
    imageUrl: string;
    initialX?: number;
    initialY?: number;
    width?: number;
    height?: number;
    innerRadius?: number;
    innerBlurWidth?: number;
}

const Glass: React.FC<DraggablePillLensProps> = ({
    imageUrl,
    width = 360,
    height = 120,
    innerRadius = 70,
    innerBlurWidth = 0,
}) => {
    const canvasSize: { x: number; y: number } = { x: window.innerWidth, y: window.innerHeight };
    const initialX: number = canvasSize.x / 2;
    const initialY: number = canvasSize.y / 2;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
    const [lensScale, setLensScale] = useState(1.0);
    const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
    const initialPinchDistance = useRef<number | null>(null);
    const baseLensScale = useRef<number>(1.0);
    const [scrollTrigger, setScrollTrigger] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollTrigger((prev) => prev + 1);
        };

        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

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

        const currentWidth = width * lensScale;
        const currentHeight = height * lensScale;
        
        const canvasContainer = document.querySelector('.canvas');
        const scrollX = canvasContainer ? canvasContainer.scrollLeft : 0;

        let scrollY = 0;
        const columns = document.querySelectorAll('.main, .sche, .others');
        
        columns.forEach(col => {
            const rect = col.getBoundingClientRect();
            if (pos.x >= rect.left && pos.x <= rect.right && pos.y >= rect.top && pos.y <= rect.bottom) {
                scrollY = col.scrollTop;
            }
        });

        canvas.width = currentWidth;
        canvas.height = currentHeight;
        const fullDocWidth = document.documentElement.scrollWidth;
        const fullDocHeight = document.documentElement.scrollHeight;

        const scaleX = imageElement.width / fullDocWidth;
        const scaleY = imageElement.height / fullDocHeight;

        const absoluteGlassCenterX = pos.x + scrollX;
        const absoluteGlassCenterY = pos.y + scrollY;

        const absoluteTopLeftX = absoluteGlassCenterX - currentWidth / 2;
        const absoluteTopLeftY = absoluteGlassCenterY - currentHeight / 2;

        ctx.clearRect(0, 0, currentWidth, currentHeight);

        const sourceX = absoluteTopLeftX * scaleX;
        const sourceY = absoluteTopLeftY * scaleY;
        const sourceWidth = currentWidth * scaleX;
        const sourceHeight = currentHeight * scaleY;

        ctx.drawImage(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, currentWidth, currentHeight);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        processGlassRefraction({
            ctx,
            startPos: { x: 0, y: 0 },
            size: { x: currentWidth, y: currentHeight },
            currentSize: { width: currentWidth, height: currentHeight },
            innerRadius: innerRadius * lensScale,
            innerBlurWidth: innerBlurWidth * lensScale,
        });
    }, [pos, imageElement, width, height, innerRadius, innerBlurWidth, lensScale]);

    const handlePointerDown = (e: React.PointerEvent) => {
        canvasRef.current?.setPointerCapture(e.pointerId);
        activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (activePointers.current.size === 1) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - pos.x,
                y: e.clientY - pos.y,
            });
        } else if (activePointers.current.size === 2) {
            setIsDragging(false);
            const pointers = Array.from(activePointers.current.values());
            const distance = Math.sqrt(
                Math.pow(pointers[0].x - pointers[1].x, 2) + Math.pow(pointers[0].y - pointers[1].y, 2),
            );
            initialPinchDistance.current = distance;
            baseLensScale.current = lensScale;
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!activePointers.current.has(e.pointerId)) return;
        activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (activePointers.current.size === 1 && isDragging) {
            setPos({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            });
        } else if (activePointers.current.size === 2 && initialPinchDistance.current !== null) {
            const pointers = Array.from(activePointers.current.values());
            const currentDistance = Math.sqrt(
                Math.pow(pointers[0].x - pointers[1].x, 2) + Math.pow(pointers[0].y - pointers[1].y, 2),
            );
            const scaleFactor = currentDistance / initialPinchDistance.current;
            const newScale = Math.min(Math.max(0.5, baseLensScale.current * scaleFactor), 3.0);
            setLensScale(newScale);
        }
    };

    const handlePointerUpOrLeave = (e: React.PointerEvent) => {
        activePointers.current.delete(e.pointerId);
        if (activePointers.current.size < 2) {
            initialPinchDistance.current = null;
        }
        if (activePointers.current.size === 0) {
            setIsDragging(false);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            onPointerCancel={handlePointerUpOrLeave}
            className="LiquidCanvas"
            style={{
                position: "absolute",
                width: `${width}px`,
                height: `${height}px`,
                top: pos.y - (height * lensScale) / 2,
                left: pos.x - (width * lensScale) / 2,
                border: `${2 * lensScale}px solid rgba(255, 255, 255, 0.2)`,
                borderRadius: `${(height * lensScale) / 2}px`,
                boxShadow: `
                    0px ${10 * lensScale}px ${20 * lensScale}px rgba(0,0,0,0.15),
                    inset 0px 0px ${15 * lensScale}px rgba(255,255,255,0.3)
                `,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                pointerEvents: "auto",
                zIndex: 1000,
            }}
        />
    );
};

export default Glass;
