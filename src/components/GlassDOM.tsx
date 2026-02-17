import React, { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { toPng } from "html-to-image";
import InvertedCircleLens from "./Glass";

interface DOMGlassWrapperProps {
    children: ReactNode;
    glassProps?: any;
    updateTrigger?: any;
}

const DOMGlassWrapper: React.FC<DOMGlassWrapperProps> = ({ children, glassProps, updateTrigger }) => {
    const domRef = useRef<HTMLDivElement>(null);
    const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState<boolean>(true);

    const resizeTimerRef = useRef<number | null>(null);

    const captureDOM = useCallback(async () => {
        if (!domRef.current) return;
        setIsCapturing(true);
        try {
            const fullWidth = domRef.current.scrollWidth;
            const fullHeight = domRef.current.scrollHeight;

            const dataUrl = await toPng(domRef.current, {
                cacheBust: true,
                skipFonts: false,
                width: fullWidth,
                height: fullHeight,
                style: {
                    transform: "none",
                },
            });
            setCapturedImageUrl(dataUrl);
        } catch (error) {
            console.error("DOM Capture Error:", error);
        } finally {
            setIsCapturing(false);
        }
    }, []);

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            captureDOM();
        }, 300);

        const handleResize = () => {
            if (resizeTimerRef.current !== null) {
                window.clearTimeout(resizeTimerRef.current);
            }
            resizeTimerRef.current = window.setTimeout(() => {
                captureDOM();
            }, 500);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(initialTimer);
            if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, [captureDOM]);

    useEffect(() => {
        if (updateTrigger === undefined) return;

        const timer = window.setTimeout(() => {
            captureDOM();
        }, 300);

        return () => window.clearTimeout(timer);
    }, [updateTrigger, captureDOM]);

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            <div
                ref={domRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
            >
                {children}
            </div>

            {capturedImageUrl && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 2,
                        pointerEvents: "none",
                    }}
                >
                    <InvertedCircleLens
                        imageUrl={capturedImageUrl}
                        width={360}
                        height={120}
                        innerRadius={95}
                        innerBlurWidth={5}
                        {...glassProps}
                    />
                </div>
            )}
        </div>
    );
};

export default DOMGlassWrapper;
