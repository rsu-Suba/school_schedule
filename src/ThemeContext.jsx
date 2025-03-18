import React, { createContext, useContext, useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";
import { useTranslation } from "react-i18next";
import { accentsColors as colors } from "@/scripts/DataPack";
import { getCookie } from "@/scripts/Cookie";
import DarkClick from "@/scripts/DarkClick";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const root = document.querySelector(":root");
   const { i18n } = useTranslation();
   const [primaryColor, setPrimaryColor] = useState(colors[0]);
   const { defaultAlgorithm, darkAlgorithm } = theme;
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [localeLang, setLocaleLang] = useState(i18n.languages[0] == "ja" ? jaJP : enUS);

   useEffect(() => {
      if (getCookie("dark") == "true") {
         setIsDarkMode(true);
         DarkClick(isDarkMode);
      }
      if (getCookie("PrimaryColor") != "") {
         setPrimaryColor(colors[getCookie("PrimaryColor")]);
         root.style.setProperty("--main-color", colors[getCookie("PrimaryColor")]);
      }
   }, []);

   return (
      <ThemeContext.Provider
         value={{ primaryColor, setPrimaryColor, isDarkMode, setIsDarkMode, localeLang, setLocaleLang }}
      >
         <ConfigProvider
            locale={localeLang}
            theme={{
               algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
               token: {
                  colorPrimary: primaryColor,
                  colorInfo: primaryColor,
               },
            }}
         >
            {children}
         </ConfigProvider>
      </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);
