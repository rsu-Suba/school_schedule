import React, { useState } from "react";
import { useTheme } from "@/ThemeContext";
import { CardBase, CardInside, SubList } from "@/components/Layout/CardComp";
import DarkSwitch from "@/components/Misc/DarkSwitch";
import useContexts from "@/scripts/Data/Contexts";
import { Select } from "antd";
import { languages } from "@/scripts/Data/DataPack";
import ColorSelect from "@/components/Misc/ColorSelect";
import { useTranslation } from "react-i18next";
import { accentsColors as colors } from "@/scripts/Data/DataPack";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";

export default function Settings() {
    const { i18n } = useTranslation();
    const { CardTitleContexts, SettingsContexts } = useContexts();
    const [_accentColor, setAccentColor] = useState(colors[0][0]);
    const theme = useTheme();
    if (!theme) return <></>;
    const { localeLang, setLocaleLang } = theme;

    const langChange = (e: string) => {
        setLocaleLang(e == "ja" ? jaJP : enUS);
        i18n.changeLanguage(e);
    };

    const SettingOptionFC = (title: string, children: React.ReactNode) => {
        return (
            <SubList>
                <div className="cardRight othercardtext">
                    <div className="subProp">
                        <p>{title}</p>
                        {children}
                    </div>
                </div>
            </SubList>
        );
    };

    return (
        <CardBase title={CardTitleContexts.Settings}>
            <CardInside>
                {SettingOptionFC(SettingsContexts.DarkTheme, <DarkSwitch />)}
                {SettingOptionFC(SettingsContexts.Color, <ColorSelect onChange={setAccentColor} />)}

                {SettingOptionFC(
                    SettingsContexts.Language,
                    <Select
                        value={localeLang.locale}
                        onChange={langChange}
                        options={languages}
                        size="small"
                        style={{ width: "auto", minWidth: 100, textAlign: "center" }}
                    />
                )}
            </CardInside>
        </CardBase>
    );
}
