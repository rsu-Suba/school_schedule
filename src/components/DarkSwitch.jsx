import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import { useTheme } from "@/ThemeContext";
import DarkClick from "@/scripts/DarkClick";

export default function DarkSwitch(props) {
   const { isDarkMode, setIsDarkMode } = useTheme();

   const handleClick = () => {
      setIsDarkMode(!isDarkMode);
      DarkClick(isDarkMode);
   };
   return <Switch checked={isDarkMode} onClick={handleClick}></Switch>;
}
