import React, { useState, useEffect } from "react";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Layout, Menu } from "antd";
import "./App.css";

const { Footer } = Layout;

export default function LabelBottomNavigation(props) {
   const [value, setValue] = useState(props.tab);
   const change = (data) => {
      props.handleValueChange(data);
   };
   const handleChange = (event, newValue) => {
      change(Number(event.key) - value);
      console.log(Number(event.key) - value);
      console.log(`Value${value}`);
   };

   useEffect(() => {
      setValue(props.tab);
   }, [props.tab]);

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
               borderTop: "1px solid var(--border-color)",
               height: "100%",
            }}
         >
            <Menu.Item
               key="0"
               icon={
                  <ClassOutlinedIcon
                     style={
                        value == "0" ? { fontSize: "24px" } : { fontSize: "24px", color: "var(--border-color)" }
                     }
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
               <div style={value == "0" ? {} : { color: "var(--border-color)" }}>Timetable</div>
            </Menu.Item>
            <Menu.Item
               key="1"
               icon={
                  <CalendarMonthOutlinedIcon
                     style={
                        value == "1" ? { fontSize: "24px" } : { fontSize: "24px", color: "var(--border-color)" }
                     }
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
               <div style={value == "1" ? {} : { color: "var(--border-color)" }}>Schedule</div>
            </Menu.Item>
            <Menu.Item
               key="2"
               icon={
                  <InfoOutlinedIcon
                     style={
                        value == "2" ? { fontSize: "24px" } : { fontSize: "24px", color: "var(--border-color)" }
                     }
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
               <div style={value == "2" ? {} : { color: "var(--border-color)" }}>Other</div>
            </Menu.Item>
         </Menu>
      </Footer>
   );
}
