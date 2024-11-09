import React, { useState, useEffect } from "react";
import { Switch } from "antd";
import darkSet from "./darkSet";

export default function DarkTheme(props) {
   const [isDarkMode, setIsDarkMode] = useState();

   useEffect(() => {
      setIsDarkMode(props.dark);
   }, [props.dark]);

   const handleClick = () => {
      setIsDarkMode((previousValue) => !previousValue);
      props.handleValueChange(isDarkMode);
      document.cookie = `dark=${!isDarkMode}`;
      darkSet(isDarkMode);
   };
   return <Switch checked={isDarkMode} onClick={handleClick}></Switch>;
}
