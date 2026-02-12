import React, { useState } from "react";
import Tabselect from "@/scripts/TabSelector";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import type { MenuInfo } from "rc-menu/lib/interface";

import "@/App.css";

const { Footer } = Layout;

export default function BottomNavigator() {
    const [value, setValue] = useState("0");

    const handleChange = (event: MenuInfo) => {
        Tabselect(Number(event.key));
        setValue(event.key);
    };

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
            style={{
                fontSize: "26px",
                ...(value === "0"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
            }}
        />,
        <CalendarMonthOutlinedIcon
            style={{
                fontSize: "26px",
                ...(value === "1"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
            }}
        />,
        <InfoOutlinedIcon
            style={{
                fontSize: "26px",
                ...(value === "2"
                    ? { color: "var(--main-color)", filter: "drop-shadow(0 0 8px var(--main-color))" }
                    : { color: "var(--text-sub-color)" }),
                transition: "all 0.3s ease",
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
                    }}
                >
                    {ButtonLabel[i]}
                </div>
            </Menu.Item>,
        );
    }

    return (
        <>
            <svg style={{ position: "fixed", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
                <defs>
                    <filter
                        id="glass-distortion"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        filterUnits="objectBoundingBox"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.01 0.01"
                            numOctaves="1"
                            seed="5"
                            result="turbulence"
                        />
                        <feComponentTransfer in="turbulence" result="mapped">
                            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
                            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
                        </feComponentTransfer>
                        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
                        <feSpecularLighting
                            in="softMap"
                            surfaceScale="5"
                            specularConstant="1"
                            specularExponent="100"
                            lightingColor="white"
                            result="specLight"
                        >
                            <fePointLight x="-200" y="-200" z="300" />
                        </feSpecularLighting>
                        <feComposite
                            in="specLight"
                            operator="arithmetic"
                            k1="0"
                            k2="1"
                            k3="1"
                            k4="0"
                            result="litImage"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="softMap"
                            scale="15"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <div className="liquid-glass-effect"></div>
            <div className="liquid-glass-tint"></div>
            <div className="liquid-glass-shine"></div>

            <Footer className="bottomFooter">
                <div
                    className="nav-indicator"
                    style={{
                        transform: `translateX(${Number(value) * 85 - (Number(value) + 1) * 9.8}%)`,
                    }}
                ></div>
                <Menu
                    onClick={handleChange}
                    selectedKeys={[value]}
                    mode="horizontal"
                    style={{
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
            </Footer>
        </>
    );
}
