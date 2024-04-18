import { useState, useEffect } from "react";
import * as React from "react";

const weekday = ["日", "月", "火", "水", "木", "金", "土"];

function expday(day) {
   return weekday[day];
}

function Clock() {
   const [date, setDate] = useState("Date...");
   const [time, setTime] = useState("Time...");

   useEffect(() => {
      setInterval(() => {
         let nowdate = new Date();
         setDate(
            `${nowdate.getMonth() + 1}/${nowdate.getDate()}/${nowdate.getFullYear()} (${weekday[nowdate.getDay()]})`
         );
         setTime(
            `${String(nowdate.getHours())}:${String(nowdate.getMinutes()).padStart(2, "0")}:${String(
               nowdate.getSeconds()
            ).padStart(2, "0")}`
         );
      }, 1000);
   }, []);

   return (
      <div className="Digit">
         <p className="digit">
            {date}
            <br></br>
            {time}
         </p>
      </div>
   );
}

export { expday, Clock };
