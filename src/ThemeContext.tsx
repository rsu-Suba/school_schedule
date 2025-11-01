import { createContext, useContext, useState, useMemo, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { ConfigProvider, theme } from "antd";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";
import { useTranslation } from "react-i18next";
import { accentsColors as colors } from "@/scripts/Data/DataPack";
import { getCookie } from "@/scripts/Server/Cookie";
import DarkClick from "@/scripts/Data/DarkClick";

type ThemeContextType = {
    primaryColor: string;
    setPrimaryColor: Dispatch<SetStateAction<string>>;
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    localeLang: typeof jaJP | typeof enUS;
    setLocaleLang: Dispatch<SetStateAction<typeof jaJP | typeof enUS>>;
    isPerformanceMode: boolean;
    setIsPerformanceMode: Dispatch<SetStateAction<boolean>>;
};

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const root = document.querySelector(":root") as HTMLElement;
    const { i18n } = useTranslation();
    const [primaryColor, setPrimaryColor] = useState(colors[0][0]);
    const { defaultAlgorithm, darkAlgorithm } = theme;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPerformanceMode, setIsPerformanceMode] = useState(true);
    const [localeLang, setLocaleLang] = useState(i18n.languages[0] == "ja" ? jaJP : enUS);
    let darkNum: number = 0;

    useEffect(() => {
        if (getCookie("dark") == "true") {
            setIsDarkMode(true);
            DarkClick(isDarkMode);
        }
        if (getCookie("PrimaryColor") != "") {
            if (isDarkMode) darkNum = 1;
            setPrimaryColor(colors[darkNum][parseInt(getCookie("PrimaryColor"))]);
            root.style.setProperty("--main-color", colors[darkNum][parseInt(getCookie("PrimaryColor"))]);
        }
    }, []);

    const themeValue = useMemo(
        () => ({
            primaryColor,
            setPrimaryColor,
            isDarkMode,
            setIsDarkMode,
            localeLang,
            setLocaleLang,
            isPerformanceMode,
            setIsPerformanceMode,
        }),
        [primaryColor, isDarkMode, localeLang, isPerformanceMode]
    );

    return (
        <ThemeContext.Provider value={themeValue}>
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
