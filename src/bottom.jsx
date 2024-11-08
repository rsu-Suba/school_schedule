import React, { useState } from "react";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import Tabselect from "./tabselect";
import "./App.css";

const { Footer } = Layout;

export default function LabelBottomNavigation() {
   const [value, setValue] = React.useState("timetable");

   const handleChange = (event, newValue) => {
      console.log(event.key);
      setValue(event.key);
      Tabselect(event.key);
   };

   return (
      <Footer style={{ padding: 0, position: "relative", bottom: 0, width: "100%", height: "100%" }}>
         <Menu
            onClick={handleChange} // 指定された関数
            selectedKeys={[value]} // 指定された選択値
            mode="horizontal"
            style={{
               display: "flex",
               justifyContent: "space-around", // アイテムを等間隔に配置
               width: "100%",
               borderTop: "1px solid #e8e8e8",
               height: "100%",
            }}
         >
            <Menu.Item
               key="timetable"
               icon={
                  <ClassOutlinedIcon
                     style={value == "timetable" ? { fontSize: "24px" } : { fontSize: "24px", color: "#bbb" }}
                  />
               }
               style={{
                  textAlign: "center",
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <div style={value == "timetable" ? {} : { color: "#bbb" }}>Timetable</div>
            </Menu.Item>
            <Menu.Item
               key="schedule"
               icon={
                  <CalendarMonthOutlinedIcon
                     style={value == "schedule" ? { fontSize: "24px" } : { fontSize: "24px", color: "#bbb" }}
                  />
               }
               style={{
                  textAlign: "center",
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <div style={value == "schedule" ? {} : { color: "#bbb" }}>Schedule</div>
            </Menu.Item>
            <Menu.Item
               key="others"
               icon={
                  <InfoOutlinedIcon
                     style={value == "others" ? { fontSize: "24px" } : { fontSize: "24px", color: "#bbb" }}
                  />
               }
               style={{
                  textAlign: "center",
                  width: "33%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <div style={value == "others" ? {} : { color: "#bbb" }}>Other</div>
            </Menu.Item>
         </Menu>
      </Footer>
   );
}
