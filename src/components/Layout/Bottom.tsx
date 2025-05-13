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
                fontSize: "24px",
                ...(value !== "0" && { color: "var(--border-color)" }),
            }}
        />,
        <CalendarMonthOutlinedIcon
            style={{
                fontSize: "24px",
                ...(value !== "1" && { color: "var(--border-color)" }),
            }}
        />,
        <InfoOutlinedIcon
            style={{
                fontSize: "24px",
                ...(value !== "2" && { color: "var(--border-color)" }),
            }}
        />,
    ];

    let BottomButtons: React.ReactNode[] = [];
    for (let i = 0; i < 3; i++) {
        BottomButtons.push(
            <Menu.Item key={String(i)} icon={Icons[i]} style={ButtonStyle}>
                <div style={{ ...(value !== String(i) && { color: "var(--border-color)" }) }}>{ButtonLabel[i]}</div>
            </Menu.Item>
        );
    }

    return (
        <Footer style={{ padding: 0, position: "relative", bottom: 0, width: "100%", height: "100%" }}>
            <Menu
                onClick={handleChange}
                selectedKeys={[value]}
                mode="horizontal"
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    borderTop: "1px solid var(--border-color)",
                    height: "100%",
                }}
            >
                {BottomButtons}
            </Menu>
        </Footer>
    );
}
