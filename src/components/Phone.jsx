import React from "react";
import "@/App.css";
import Clock from "@/components/clock.jsx";
import SubjectList from "@/components/SubjectList";
import Calendar from "@/components/calendar.jsx";
import Other from "@/components/other.jsx";
import ChangeInteg from "@/components/changeInteg.jsx";
import Timetable from "@/components/Timetable.jsx";
import BottomNavigator from "@/components/Bottom.jsx";

export default function Phone({ recentNum, nowtime, todayNum }) {
   return (
      <div className="mainCanvas">
         <div className="canvas" id="canvas">
            <div className="main" id="main">
               <div className="mainCards">
                  <Clock />
                  <SubjectList key={"card1"} num={recentNum} pos={"top"} nowtime={nowtime} mode={"main"} />
                  <ChangeInteg />
                  <Timetable key={"cardTimes"} num={todayNum} />
                  <div className="blankCard"></div>
               </div>
            </div>
            <div className="sche" id="sche">
               <Calendar />
            </div>
            <div className="others" id="others">
               <div className="otherCards">
                  <Other/>
               </div>
            </div>
         </div>
         <div className="bottomCanvas">
            <BottomNavigator />
         </div>
      </div>
   );
}
