import React, { useState, useEffect, useRef } from "react";
import { TabSelector, initSwipeHandlers, initIndicatorDrag } from "@/scripts/TabSelector";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";
import { useTheme } from "@/ThemeContext";
import { useLiquidGlass } from "@/scripts/Glass/useLiquidGlass";
import "@/App.css";

const { Footer } = Layout;

export default function BottomNavigator() {
    const [value, setValue] = useState("0");
    const [isMoving, setIsMoving] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);

    const theme = useTheme();
    const isDarkMode = theme?.isDarkMode;
    const primaryColor = theme?.primaryColor;

    const { footerRef, canvasRef } = useLiquidGlass(value, isMoving, isDarkMode, primaryColor);

    const triggerMove = (prev: string, next: string) => {
        if (prev === next) return;
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
                              setIsMoving(true);
                              TabSelector(nextTab);
                              setTimeout(() => setIsMoving(false), 400);
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
                    className="MenuButton"
                    style={{
                        ...(value === String(i)
                            ? {
                                  color: "var(--main-color)",
                                  fontWeight: "600",
                                  textShadow: "0 0 10px rgba(var(--main-color-rgb), 0.5)",
                              }
                            : { color: "var(--text-sub-color)" }),
                    }}
                >
                    {ButtonLabel[i]}
                </div>
            </Menu.Item>,
        );
    }

    return (
        <Footer className="bottomFooter" style={{ backgroundColor: "transparent", border: "none" }}>
            <div className="footerRef" ref={footerRef}>
                <canvas className="canvasRef" ref={canvasRef} />
                <div className="LiquidGlassEffect" />
                <div
                    className="nav-indicator"
                    ref={indicatorRef}
                    style={{ transform: `translateX(${Number(value) * 79.6}%) scaleX(${isMoving ? 1.2 : 1})` }}
                />
                <Menu onClick={handleChange} selectedKeys={[value]} mode="horizontal">
                    {BottomButtons}
                </Menu>
            </div>
        </Footer>
    );
}