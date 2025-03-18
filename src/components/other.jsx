import React from "react";
import "@/App.css";
import DarkSwitch from "@/components/DarkSwitch.jsx";
import Settings from "@/components/Settings";
import { CardBase, CardInside, SubList } from "@/components/CardComp";
import useContexts from "@/scripts/Contexts";

function cardMake(title, prop) {
   return (
      <CardBase title={title}>
         <CardInside>
            <SubList>
               <div className="cardRight othercardtext">{prop}</div>
            </SubList>
         </CardInside>
      </CardBase>
   );
}

export default function Other(props) {
   const { CardTitleContexts, InfoContexts } = useContexts();

   return (
      <>
         <Settings/>
         {cardMake(CardTitleContexts.PlannedFeatures, [
            <div className="subProp">
               <p className="othercardsub">{InfoContexts.PlannedFeatures}</p>
            </div>,
         ])}
         {cardMake(CardTitleContexts.Info, [
            <p className="othercardsub">
               <a href="https://github.com/rsu-Suba/school_schedule" target="_blank">
                  Repository
               </a>
            </p>,
            <p className="subName">
               <a href="https://ja.react.dev/" target="_blank">
                  React
               </a>
               ,&nbsp;
               <a href="https://ant.design/" target="_blank">
                  Ant Design
               </a>
               , JavaScript, Google Apps Script, ChatGPT
            </p>,
            <p className="subName">
               Made by{" "}
               <a href="https://github.com/rsu-Suba" target="_blank">
                  rsu-Suba
               </a>
            </p>,
            <h4 className="lastText" style={{ textAlign: "right" }}>
               {InfoContexts.UpdateTitle} {InfoContexts.UpdateVersion}
            </h4>,
         ])}
      </>
   );
}
