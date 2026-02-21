import { useState, useEffect, useRef, useCallback } from "react";
import { toCanvas } from "html-to-image";
import { GlassRenderer } from "@/scripts/Glass/GlassProcessor";

export const useLiquidGlass = (
    value: string,
    isMoving: boolean,
    isDarkMode: boolean | undefined,
    primaryColor: string | undefined,
) => {
    const footerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<GlassRenderer | null>(null);
    const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const isCapturing = useRef(false);
    const canvasCache = useRef<Record<string, HTMLCanvasElement>>({});
    const heightCache = useRef<Record<string, number>>({});
    const isMovingRef = useRef(isMoving);

    useEffect(() => {
        isMovingRef.current = isMoving;
    }, [isMoving]);

    const isInteractingRef = useRef(false);
    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const updateRequested = useRef(false);
    const forceUpdateRequested = useRef(false);

    const markInteraction = useCallback(() => {
        isInteractingRef.current = true;
        if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
        interactionTimeoutRef.current = setTimeout(() => {
            isInteractingRef.current = false;
        }, 400);
    }, []);

    useEffect(() => {
        window.addEventListener("touchstart", markInteraction, { passive: true });
        window.addEventListener("touchmove", markInteraction, { passive: true });
        window.addEventListener("touchend", markInteraction, { passive: true });
        return () => {
            window.removeEventListener("touchstart", markInteraction);
            window.removeEventListener("touchmove", markInteraction);
            window.removeEventListener("touchend", markInteraction);
        };
    }, [markInteraction]);

    useEffect(() => {
        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
        };
    }, []);

    const getActiveScrollTop = useCallback(() => {
        const containerId = value === "0" ? "main" : value === "1" ? "sche" : "others";
        const containerEl = document.getElementById(containerId);
        const contentEl = containerEl?.firstElementChild as HTMLElement | null;
        return (containerEl?.scrollTop || 0) + (contentEl?.scrollTop || 0);
    }, [value]);

    const captureBackground = useCallback(async (forceUpdate: boolean = false) => {
        if (isCapturing.current) return;

        const canvasEl = document.getElementById("canvas");
        if (!canvasEl) return;

        let maxScrollHeight = 0;
        ["main", "sche", "others"].forEach((id) => {
            const tab = document.getElementById(id);
            const content = tab?.firstElementChild as HTMLElement | null;
            const h = content ? content.scrollHeight : tab ? tab.scrollHeight : 0;
            if (h > maxScrollHeight) maxScrollHeight = h;
        });

        const parentWidth = canvasEl.parentElement?.clientWidth || window.innerWidth;
        const currentWidth = parentWidth * 3;
        const currentHeight = maxScrollHeight || window.innerHeight;

        if (
            !forceUpdate &&
            canvasCache.current["ALL"] &&
            Math.abs((heightCache.current["ALL"] || 0) - currentHeight) < 5
        ) {
            return;
        }

        isCapturing.current = true;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let hiddenStudio: HTMLDivElement | null = null;

        try {
            hiddenStudio = document.createElement("div");
            hiddenStudio.style.position = "absolute";
            hiddenStudio.style.left = "-9999px";
            hiddenStudio.style.top = "0";
            hiddenStudio.style.width = `${currentWidth}px`;
            hiddenStudio.style.height = `${currentHeight}px`;
            hiddenStudio.style.pointerEvents = "none";
            hiddenStudio.style.opacity = "0";
            hiddenStudio.style.zIndex = "-9999";

            const clone = canvasEl.cloneNode(true) as HTMLElement;
            clone.style.setProperty("display", "flex", "important");
            clone.style.setProperty("flex-direction", "row", "important");
            clone.style.setProperty("width", `${currentWidth}px`, "important");
            clone.style.setProperty("height", `${currentHeight}px`, "important");
            clone.style.setProperty("left", "0", "important");
            clone.style.setProperty("transform", "none", "important");
            clone.style.setProperty("transition", "none", "important");

            ["main", "sche", "others"].forEach((id) => {
                const tab = clone.querySelector(`#${id}`) as HTMLElement | null;
                if (tab) {
                    tab.style.setProperty("display", "block", "important");
                    tab.style.setProperty("width", `${parentWidth}px`, "important");
                    tab.style.setProperty("min-width", `${parentWidth}px`, "important");
                    tab.style.setProperty("flex-shrink", "0", "important");
                    tab.style.setProperty("height", `${currentHeight}px`, "important");
                    tab.style.setProperty("max-height", "none", "important");
                    tab.style.setProperty("overflow", "visible", "important");
                    tab.style.setProperty("visibility", "visible", "important");
                    tab.style.setProperty("opacity", "1", "important");

                    const content = tab.firstElementChild as HTMLElement | null;
                    if (content) {
                        content.style.setProperty("height", `${currentHeight}px`, "important");
                        content.style.setProperty("max-height", "none", "important");
                        content.style.setProperty("overflow", "visible", "important");
                    }
                }
            });

            document.body.appendChild(hiddenStudio);
            hiddenStudio.appendChild(clone);

            const computedBgColor = window.getComputedStyle(document.body).backgroundColor;

            const canvas = await toCanvas(clone, {
                backgroundColor: computedBgColor,
                pixelRatio: dpr,
                width: currentWidth,
                height: currentHeight,
                style: { transform: "none", margin: "0", padding: "0" },
            });

            canvasCache.current["ALL"] = canvas;
            heightCache.current["ALL"] = currentHeight;
            setSourceCanvas(canvas);
        } catch (error) {
            console.error("DOMキャプチャ失敗:", error);
        } finally {
            if (hiddenStudio && hiddenStudio.parentNode) {
                hiddenStudio.parentNode.removeChild(hiddenStudio);
            }
            isCapturing.current = false;
        }
    }, []);

    const requestCapture = useCallback((force: boolean = false) => {
        if (force) forceUpdateRequested.current = true;
        else updateRequested.current = true;
    }, []);

    useEffect(() => {
        requestCapture(true);
    }, [isDarkMode, primaryColor, requestCapture]);

    useEffect(() => {
        captureBackground();

        const intervalId = setInterval(() => {
            if (isMovingRef.current || isInteractingRef.current || isCapturing.current) {
                return;
            }

            if (forceUpdateRequested.current) {
                forceUpdateRequested.current = false;
                updateRequested.current = false;
                captureBackground(true);
            } else if (updateRequested.current) {
                updateRequested.current = false;
                captureBackground();
            } else {
                let maxScrollHeight = 0;
                ["main", "sche", "others"].forEach((id) => {
                    const tab = document.getElementById(id);
                    const content = tab?.firstElementChild as HTMLElement | null;
                    const h = content ? content.scrollHeight : tab ? tab.scrollHeight : 0;
                    if (h > maxScrollHeight) maxScrollHeight = h;
                });
                const currentHeight = maxScrollHeight || window.innerHeight;

                if (Math.abs((heightCache.current["ALL"] || 0) - currentHeight) >= 20) {
                    captureBackground();
                }
            }
        }, 300);

        return () => clearInterval(intervalId);
    }, [captureBackground]);

    useEffect(() => {
        if (!isMoving) {
            requestCapture();
        }
    }, [isMoving, requestCapture]);

    useEffect(() => {
        if (!footerRef.current) return;
        const updateSize = () => {
            setDimensions({
                width: footerRef.current!.clientWidth,
                height: footerRef.current!.clientHeight,
            });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const drawGlass = useCallback(() => {
        const canvas = canvasRef.current;
        const canvasEl = document.getElementById("canvas");

        if (!canvas || !sourceCanvas || dimensions.width === 0 || !canvasEl || !footerRef.current) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (!rendererRef.current) {
            try {
                rendererRef.current = new GlassRenderer();
            } catch (e) {
                return;
            }
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(dimensions.width * dpr);
        canvas.height = Math.round(dimensions.height * dpr);

        const footerRect = footerRef.current.getBoundingClientRect();
        const canvasRect = canvasEl.getBoundingClientRect();

        const X_TWEAK_PX = 0;
        const offsetX = (footerRect.left - canvasRect.left + X_TWEAK_PX) * dpr;

        const tabScrollTop = getActiveScrollTop();
        let outerScrollTop = 0;
        let current = canvasEl.parentElement;
        while (current && current !== document.body && current !== document.documentElement) {
            outerScrollTop += current.scrollTop;
            current = current.parentElement;
        }

        const offsetY = (footerRect.top - canvasRect.top + tabScrollTop + outerScrollTop) * dpr;

        rendererRef.current.render({
            ctx,
            sourceCanvas,
            physicalWidth: canvas.width,
            physicalHeight: canvas.height,
            offsetX,
            offsetY,
            compressionPower: 2.0,
        });
    }, [sourceCanvas, dimensions, getActiveScrollTop]);

    useEffect(() => {
        let frameId: number;
        const animate = () => {
            drawGlass();
            if (isMoving) {
                frameId = requestAnimationFrame(animate);
            }
        };

        if (isMoving) {
            frameId = requestAnimationFrame(animate);
        } else {
            requestAnimationFrame(() => drawGlass());
        }

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [isMoving, drawGlass]);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    drawGlass();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, [drawGlass]);

    return { footerRef, canvasRef };
};
