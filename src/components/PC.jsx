import React from "react";
import "@/App.css";
import Clock from "@/components/clock.jsx";
import SubjectList from "@/components/SubjectList";
import Calendar from "@/components/calendar.jsx";
import Menu from "@/components/menu.jsx";
import ChangeInteg from "@/components/changeInteg.jsx";
import Timetable from "@/components/Timetable.jsx";

export default function PC({recentNum, nowtime, todayNum}) {
   return (
      <div className="mainCanvas">
         <div className="PCCanvas">
            <div className="main" id="main">
               <div className="mainCards">
                  <Clock />
                  <SubjectList num={recentNum} nowtime={nowtime} mode={"main"} />
                  <ChangeInteg />
                  <Timetable num={todayNum} />
               </div>
            </div>
            <div className="sche" id="sche">
               <Calendar />
            </div>
         </div>
         <Menu />
      </div>
   );
}
