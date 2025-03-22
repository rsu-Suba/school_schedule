import React from "react";
import { useTheme } from "@/ThemeContext";
import { CheckCircleFilled } from "@ant-design/icons";
import { accentsColors as colors } from "@/scripts/Data/DataPack";
import { postCookie } from "@/scripts/Server/Cookie";

export default function ColorSelect({
   onChange,
}: {
   onChange: React.Dispatch<React.SetStateAction<string>>;
}) {
   const root = document.querySelector(":root") as HTMLElement;
   const theme = useTheme();
   if (!theme) return <></>;
   const { primaryColor, setPrimaryColor } = theme;

   const handleColorChange = (color: number) => {
      postCookie("PrimaryColor", color);
      setPrimaryColor(colors[color]);
      root.style.setProperty("--main-color", colors[color]);
      if (onChange) onChange(colors[color]);
   };

   return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
         {colors.map((color) => (
            <div
               key={color}
               style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  border: primaryColor === color ? "2px solid black" : "1px solid #ccc",
                  backgroundColor: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
               }}
               onClick={() => handleColorChange(colors.indexOf(color))}
            >
               {primaryColor === color && <CheckCircleFilled style={{ color: "white", fontSize: "16px" }} />}
            </div>
         ))}
      </div>
   );
}
