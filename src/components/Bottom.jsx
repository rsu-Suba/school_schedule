import React, { useState, useEffect } from "react";
import Tabselect from "@/scripts/TabSelector.js";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import "@/App.css";

const { Footer } = Layout;

export default function BottomNavigator(props) {
   const [value, setValue] = useState("0");

   const handleChange = (event) => {
      Tabselect(Number(event.key));
      setValue(event.key);
   };

   const ButtonStyle = {
      textAlign: "center",
      width: "33%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
   };

   const ButtonLabel = ["Timetable", "Schedule", "Other"];
   const Icons = [
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

   let BottomButtons = [];
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
