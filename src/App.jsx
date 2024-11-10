import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import "./App.css?dark=1";
import Clock from "./clock.jsx";
import Bottom from "./bottom.jsx";
import Card from "./card.jsx";
import Calendar from "./calendar.jsx";
import Other from "./other.jsx";
import Menu from "./menu.jsx";
import ChangeMix from "./changeMix.jsx";
import Tabs from "./tabs.jsx";
import darkSet from "./darkSet";
import getCookie from "./getCookie";
import DarkNotice from "./darkNotice";
import TabCont from "./tabCont";


function App(props) {
   const { defaultAlgorithm, darkAlgorithm } = theme;
   const [isDarkMode, setIsDarkMode] = useState(false);
   const [activeTab, setActiveTab] = useState(0);
   const aspectRatio = useAspectRatio();
   let date = new Date();
   let recentNum = date.getDay();
   let todayNum = date.getDay();
   let nowtime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;
   let isDarkFirst = getCookie("isDarkFirst") == "" ? true : false;

   /*
   recentNum = 1;
   todayNum = recentNum;
   nowtime = 910;
*/
   const darkcall = (data) => {
      setIsDarkMode(!data);
   };

   useEffect(() => {
      if (getCookie("dark") == "true") {
         darkcall();
         darkSet(isDarkMode);
      }
   }, []);

   if (window.innerHeight > window.innerWidth) {
      return (
         <>
            <ConfigProvider
               theme={{
                  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
               }}
            >
               <div className="mainCanvas">
                  {isDarkFirst ? <DarkNotice handleValueChange={darkcall} /> : <></>}
                  <div className="canvas" id="canvas">
                     <div className="main" id="main">
                        <div className="mainCards">
                           <Clock />
                           <Card
                              key={"card1"}
                              card={"Up Next"}
                              num={recentNum}
                              pos={"top"}
                              nowtime={nowtime}
                              mode={"main"}
                           />
                           <ChangeMix card="Change" />
                           <Tabs key={"cardTimes"} num={todayNum} />
                           <div className="blankCard"></div>
                        </div>
                     </div>
                     <div className="sche" id="sche">
                        <Calendar />
                     </div>
                     <div className="others" id="others">
                        <div className="otherCards">
                           <Other handleValueChange={darkcall} dark={isDarkMode} />
                        </div>
                     </div>
                  </div>
                  <div className="bottomCanvas">
                    <TabCont/>
                  </div>
               </div>
            </ConfigProvider>
         </>
      );
   } else {
      return (
         <>
            <ConfigProvider
               theme={{
                  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
               }}
            >
               <div className="mainCanvas">
                  {isDarkFirst ? <DarkNotice handleValueChange={darkcall} /> : <></>}
                  <div className="PCCanvas">
                     <div className="main" id="main">
                        <div className="mainCards">
                           <Clock />
                           <Card
                              key={"card1"}
                              card={"Up Next"}
                              num={recentNum}
                              pos={"top"}
                              nowtime={nowtime}
                              mode={"main"}
                           />
                           <ChangeMix card="Change" />
                           <Tabs key={"cardTimes"} num={todayNum} />
                           <div className="blankCard"></div>
                        </div>
                     </div>
                     <div className="sche" id="sche">
                        <Calendar />
                     </div>
                  </div>
                  <Menu handleValueChange={darkcall} dark={isDarkMode} />
               </div>
            </ConfigProvider>
         </>
      );
   }
}

function useAspectRatio() {
   const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);

   useEffect(() => {
      const handleResize = () => {
         const newAspectRatio = window.innerWidth / window.innerHeight;
         setAspectRatio(newAspectRatio);
      };

      // リサイズイベントを追加
      window.addEventListener("resize", handleResize);

      // クリーンアップ関数でイベントリスナーを削除
      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return aspectRatio;
}

export default App;
