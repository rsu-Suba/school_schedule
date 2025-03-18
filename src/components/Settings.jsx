import React, { useState } from "react";
import { useTheme } from "@/ThemeContext";
import { CardBase, CardInside, SubList } from "@/components/CardComp";
import DarkSwitch from "@/components/DarkSwitch";
import useContexts from "@/scripts/Contexts";
import { Select } from "antd";
import { languages } from "@/scripts/DataPack";
import ColorSelect from "@/components/ColorSelect";
import { useTranslation } from "react-i18next";
import { accentsColors as colors } from "@/scripts/DataPack";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";

export default function Settings() {
   const { i18n } = useTranslation();
   const { CardTitleContexts, SettingsContexts } = useContexts();
   const [accentColor, setAccentColor] = useState(colors[0]);
   const { localeLang, setLocaleLang } = useTheme();

   const langChange = (e) => {
      setLocaleLang(e == "ja" ? jaJP : enUS);
      i18n.changeLanguage(e);
   };

   const SettingOptionFC = (title, children) => {
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
            {SettingOptionFC(SettingsContexts.Color, <ColorSelect value={accentColor} onChange={setAccentColor} />)}
            {SettingOptionFC(
               SettingsContexts.Language,
               <Select
                  value={localeLang.locale}
                  label="Time"
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
