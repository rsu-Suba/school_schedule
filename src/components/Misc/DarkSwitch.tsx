import { Switch } from "antd";
import { useTheme } from "@/ThemeContext";
import DarkClick from "@/scripts/Data/DarkClick";

export default function DarkSwitch() {
   const theme = useTheme();
   if (!theme) return <></>;
   const { isDarkMode, setIsDarkMode } = theme;

   const handleClick = () => {
      setIsDarkMode(!isDarkMode);
      DarkClick(isDarkMode);
   };
   return <Switch checked={isDarkMode} onClick={handleClick}></Switch>;
}
