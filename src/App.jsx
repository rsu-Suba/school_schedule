import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { ThemeProvider } from "./ThemeContext";
import "./App.css";
import DarkClick from "@/scripts/DarkClick.js";
import { getCookie } from "@/scripts/Cookie.js";
import getCustomDate from "@/scripts/getCustomDate.js";
import AspectDetector from "@/scripts/AspectDetector";
import PC from "@/components/PC";
import Phone from "@/components/Phone";

function App() {
   const aspectRatio = AspectDetector();
   let date = new Date();
   let recentNum = date.getDay();
   let todayNum = date.getDay();
   let nowtime = getCustomDate(String(date), "HHmm");

   //recentNum = 5;
   //todayNum = recentNum;
   //nowtime = 910;

   const CanvasProps = {
      recentNum: recentNum,
      nowtime: nowtime,
      todayNum: todayNum
   };


   return (
      <ThemeProvider>
         {window.innerHeight > window.innerWidth ? <Phone {...CanvasProps} /> : <PC {...CanvasProps} />}
      </ThemeProvider>
   );
}

export default App;
