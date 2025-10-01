import { Switch } from "antd";
import { useTheme } from "@/ThemeContext";
import performanceModeClick from "@/scripts/Data/PerformanceClick";

export default function PerformanceSwitch() {
   const theme = useTheme();
   if (!theme) return <></>;
   const { isPerformanceMode, setIsPerformanceMode } = theme;

   const handleClick = () => {
      const newMode = !isPerformanceMode;
      setIsPerformanceMode(newMode);
      performanceModeClick(newMode);
   };
   return <Switch checked={isPerformanceMode} onClick={handleClick}></Switch>;
}