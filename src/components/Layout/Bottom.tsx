import React, { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { TabSelector, initSwipeHandlers, initIndicatorDrag } from "@/scripts/TabSelector";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";

import "@/App.css";

const { Footer } = Layout;

export default function BottomNavigator() {
    const [value, setValue] = useState("0");
    const [isMoving, setIsMoving] = useState(false);
    const [moveDir, setMoveDir] = useState(0);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const isCapturing = useRef(false);

    const canvasCache = useRef<Record<string, HTMLCanvasElement>>({});
    const heightCache = useRef<Record<string, number>>({});

    const getActiveElements = useCallback(() => {
        const containerId = value === "0" ? "main" : value === "1" ? "sche" : "others";
        const containerEl = document.getElementById(containerId);
        const contentEl = containerEl?.firstElementChild as HTMLElement | null;
        return { containerEl, contentEl };
    }, [value]);

    const captureBackground = useCallback(
        async (forceUpdate = false) => {
            const { contentEl } = getActiveElements();
            if (!contentEl || isCapturing.current) return;
            const currentHeight = contentEl.scrollHeight;
            if (!forceUpdate && canvasCache.current[value] && heightCache.current[value] === currentHeight) {
                setSourceCanvas(canvasCache.current[value]);
                return;
            }

            isCapturing.current = true;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            try {
                const canvas = await html2canvas(contentEl, {
                    backgroundColor: "#f4f7fc",
                    useCORS: true,
                    scale: dpr,
                    logging: false,
                    height: currentHeight,
                    windowHeight: currentHeight,
                });

                canvasCache.current[value] = canvas;
                heightCache.current[value] = currentHeight;
                setSourceCanvas(canvas);
            } catch (error) {
                console.error("DOMキャプチャ失敗:", error);
            } finally {
                isCapturing.current = false;
            }
        },
        [getActiveElements, value],
    );

    useEffect(() => {
        const { contentEl } = getActiveElements();
        if (!contentEl) return;
        let debounceTimer: NodeJS.Timeout;
        const mutationObserver = new MutationObserver(() => {
            const currentHeight = contentEl.scrollHeight;
            if (heightCache.current[value] !== currentHeight) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    captureBackground(true);
                }, 300);
            }
        });

        mutationObserver.observe(contentEl, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => {
            mutationObserver.disconnect();
            clearTimeout(debounceTimer);
        };
    }, [getActiveElements, captureBackground, value]);

    useEffect(() => {
        captureBackground();
    }, [captureBackground, value]);

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
        const { containerEl, contentEl } = getActiveElements();

        if (!canvas || !sourceCanvas || dimensions.width === 0 || !containerEl || !contentEl || !footerRef.current) {
            if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const physicalWidth = Math.round(dimensions.width * dpr);
        const physicalHeight = Math.round(dimensions.height * dpr);

        canvas.width = physicalWidth;
        canvas.height = physicalHeight;

        const footerRect = footerRef.current.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();

        const scrollTop = (containerEl.scrollTop || 0) + (contentEl.scrollTop || 0);
        const offsetX = (footerRect.left - contentRect.left) * dpr;
        const offsetY = (footerRect.top - contentRect.top + scrollTop) * dpr;

        ctx.clearRect(0, 0, physicalWidth, physicalHeight);
        ctx.drawImage(sourceCanvas, -offsetX, -offsetY);

        try {
            const imageData = ctx.getImageData(0, 0, physicalWidth, physicalHeight);
            const data = imageData.data;
            const newData = new Uint8ClampedArray(data.length);

            const isHorizontal = physicalWidth >= physicalHeight;
            const radius = isHorizontal ? physicalHeight / 2 : physicalWidth / 2;
            const spineStartX = isHorizontal ? radius : physicalWidth / 2;
            const spineEndX = isHorizontal ? physicalWidth - radius : physicalWidth / 2;
            const spineStartY = isHorizontal ? physicalHeight / 2 : radius;
            const spineEndY = isHorizontal ? physicalHeight / 2 : physicalHeight - radius;

            const innerRatio = 0.57;
            const innerBlurWidth = 4 * dpr;
            const innerRadius = radius * innerRatio;

            for (let y = 0; y < physicalHeight; y++) {
                for (let x = 0; x < physicalWidth; x++) {
                    const cx = Math.max(spineStartX, Math.min(x, spineEndX));
                    const cy = Math.max(spineStartY, Math.min(y, spineEndY));
                    const dx = x - cx;
                    const dy = y - cy;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const destIndex = (y * physicalWidth + x) * 4;

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

                        if (srcX >= 0 && srcX < physicalWidth && srcY >= 0 && srcY < physicalHeight) {
                            const srcIndex = (srcY * physicalWidth + srcX) * 4;
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
            ctx.putImageData(new ImageData(newData, physicalWidth, physicalHeight), 0, 0);
        } catch (e) {}
    }, [sourceCanvas, dimensions, getActiveElements]);

    useEffect(() => {
        if (!sourceCanvas) return;
        let count = 0;
        let frameId: number;

        const animate = () => {
            drawGlass();
            count++;
            if (count < 3) {
                frameId = requestAnimationFrame(animate);
            }
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [drawGlass, sourceCanvas]);

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

    useEffect(() => {
        let frameId: number;
        const animate = () => {
            drawGlass();
            frameId = requestAnimationFrame(animate);
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

    const triggerMove = (prev: string, next: string) => {
        if (prev === next) return;
        setMoveDir(Number(next) > Number(prev) ? 1 : -1);
        setIsMoving(true);
        TabSelector(Number(next));
        setValue(next);
        setTimeout(() => setIsMoving(false), 400);
    };

    const handleChange = (event: MenuInfo) => {
        triggerMove(value, event.key);
    };

    useEffect(() => {
        const cleanupSwipe = initSwipeHandlers((direction) => {
            setValue((prev) => {
                const nextValue = Math.min(Math.max(Number(prev) + direction, 0), 2);
                const nextValueStr = String(nextValue);
                if (nextValueStr !== prev) {
                    setMoveDir(direction);
                    setIsMoving(true);
                    TabSelector(nextValue);
                    setTimeout(() => setIsMoving(false), 400);
                }
                return nextValueStr;
            });
        });

        const cleanupDrag =
            indicatorRef.current && footerRef.current
                ? initIndicatorDrag(indicatorRef.current, footerRef.current, (nextTab) => {
                      const nextTabStr = String(nextTab);
                      setValue((prev) => {
                          if (prev !== nextTabStr) {
                              TabSelector(nextTab);
                          }
                          return nextTabStr;
                      });
                  })
                : null;

        return () => {
            cleanupSwipe();
            if (cleanupDrag) cleanupDrag();
        };
    }, []);

    const ButtonStyle: React.CSSProperties = {
        textAlign: "center",
        width: "33%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    };

    const ButtonLabel: string[] = ["Timetable", "Schedule", "Other"];
    const Icons: React.ReactNode[] = [
        <ClassOutlinedIcon
            key="0"
            style={{
                fontSize: "26px",
                ...(value === "0"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
                zIndex: "3",
            }}
        />,
        <CalendarMonthOutlinedIcon
            key="1"
            style={{
                fontSize: "26px",
                ...(value === "1"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
                zIndex: "3",
            }}
        />,
        <InfoOutlinedIcon
            key="2"
            style={{
                fontSize: "26px",
                ...(value === "2"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
                zIndex: "3",
            }}
        />,
    ];

    let BottomButtons: React.ReactNode[] = [];
    for (let i = 0; i < 3; i++) {
        BottomButtons.push(
            <Menu.Item key={String(i)} icon={Icons[i]} style={ButtonStyle}>
                <div
                    style={{
                        ...(value === String(i)
                            ? {
                                  color: "var(--main-color)",
                                  fontWeight: "600",
                                  textShadow: "0 0 10px rgba(var(--main-color-rgb), 0.5)",
                              }
                            : { color: "var(--text-sub-color)" }),
                        fontSize: "12px",
                        marginTop: "0px",
                        transition: "all 0.3s ease",
                        position: "relative",
                        zIndex: "3",
                    }}
                >
                    {ButtonLabel[i]}
                </div>
            </Menu.Item>,
        );
    }

    return (
        <Footer className="bottomFooter" style={{ backgroundColor: "transparent", border: "none", padding: 0 }}>
            <div
                ref={footerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    borderRadius: "9999px",
                    overflow: "hidden",
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderTop: "1px solid rgba(255, 255, 255, 0.4)",
                        boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.1)",
                        pointerEvents: "none",
                        boxSizing: "border-box",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        zIndex: 1,
                    }}
                />

                <div
                    className="nav-indicator"
                    ref={indicatorRef}
                    style={{
                        position: "absolute",
                        transform: `translateX(${Number(value) * 85 - (Number(value) + 1) * 9.8}%) scaleX(${isMoving ? 1.2 : 1}) scaleY(${isMoving ? 1.4 : 1})`,
                        width: "43.3333%",
                        height: "100%",
                        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "grab",
                        zIndex: 2,
                    }}
                />

                <Menu
                    onClick={handleChange}
                    selectedKeys={[value]}
                    mode="horizontal"
                    style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                        border: "none",
                        zIndex: 10,
                    }}
                >
                    {BottomButtons}
                </Menu>
            </div>
        </Footer>
    );
}
