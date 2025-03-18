import React, { useState, useEffect } from "react";
import { useTheme } from "@/ThemeContext";
import { weekday } from "@/scripts/DataPack";

export default function Clock() {
   const { localeLang } = useTheme();
   const lang = localeLang.locale;

   const [date, setDate] = useState("Date...");
   const [time, setTime] = useState("Time...");

   const ClockFC = () => {
      const date = new Date();
      let clockDate = "";
      let clockTime = "";
      if (lang == "en") {
         clockDate = `${weekday.en[date.getDay()]}day, ${new Intl.DateTimeFormat("en", { month: "long" }).format(
            date
         )} ${date.getDate()}`;
      } else {
         clockDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${weekday.ja[date.getDay()]})`;
      }
      clockTime = `${String(date.getHours())}:${String(date.getMinutes()).padStart(2, "0")}:${String(
         date.getSeconds()
      ).padStart(2, "0")}`;

      return { clockDate, clockTime };
   };

   useEffect(() => {
      setInterval(() => {
         const { clockDate, clockTime } = ClockFC();
         setDate(clockDate);
         setTime(clockTime);
      });
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
