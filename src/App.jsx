import React, { useState, useEffect } from "react";
import "./App.css";
import { Clock, expday } from "./clock.jsx";
import Bottom from "./bottom.jsx";
import Card from "./card.jsx";
import Calendar from "./calendar.jsx";
import Other from "./other.jsx";
import Menu from "./menu.jsx";
import ChangeMix from "./changeMix.jsx";
import Tabs from "./tabs.jsx";
import { fetchData } from "./changeGet";

function App() {
   let date = new Date();
   let tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));
   let recentNum = date.getDay();
   let todayNum = date.getDay();
   let tomorrowNum = tomorrowDate.getDay();
   let todayText = `${date.getMonth() + 1}/${date.getDate()}/${expday(date.getDay())}曜日`;
   let tomorrowText = `${tomorrowDate.getMonth() + 1}/${tomorrowDate.getDate()}/${expday(tomorrowDate.getDay())}曜日`;
   let nowtime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;

   /*
   recentNum = 2;
   todayNum = recentNum;
   tomorrowNum = recentNum++;
   nowtime = 910;
   */

   if (window.innerHeight > window.innerWidth) {
      return (
         <>
            <div className="mainCanvas">
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
                        <Other />
                     </div>
                  </div>
               </div>
               <div className="bottomCanvas">
                  <Bottom />
               </div>
            </div>
         </>
      );
   } else {
      return (
         <>
            <div className="mainCanvas">
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
                           <ChangeMix card="Change"/>
                        <Tabs key={"cardTimes"} num={todayNum} />
                        <div className="blankCard"></div>
                     </div>
                  </div>
                  <div className="sche" id="sche">
                     <Calendar />
                  </div>
               </div>
               <Menu />
            </div>
         </>
      );
   }
}

export default App;
