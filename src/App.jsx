import React from "react";
import "./App.css";
import { Clock, expday } from "./clock.jsx";
import Bottom from "./bottom.jsx";
import Card from "./card.jsx";
import Calendar from "./calendar.jsx";
import Other from "./other.jsx";

function App() {
   let date = new Date();
   let tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1));
   let recentNum = date.getDay();
   let todayNum = date.getDay();
   let tomorrowNum = tomorrowDate.getDay();
   let todayText = `${date.getMonth() + 1}/${date.getDate()}/${expday(date.getDay())}曜日`;
   let tomorrowText = `${tomorrowDate.getMonth() + 1}/${tomorrowDate.getDate()}/${expday(tomorrowDate.getDay())}曜日`;
   let nowtime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}`;

   //recentNum = 6;
   //nowtime = 1440;
   
   return (
      <>
         <div className="mainCanvas">
            <div className="canvas" id="canvas">
               <div className="main" id="main">
                  <div className="mainCards">
                     <Clock />
                     <Card key={"card1"} card={"Up Next"} num={recentNum} pos={"top"} nowtime={nowtime} />
                     <Card key={"card2"} card={todayText} num={todayNum} pos={"mid"} />
                     <Card key={"card3"} card={tomorrowText} num={tomorrowNum} pos={"bottom"} />
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
}

export default App;
