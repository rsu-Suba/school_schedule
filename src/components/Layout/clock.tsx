import { useState, useEffect } from "react";
import { useTheme } from "@/ThemeContext";
import { weekday } from "@/scripts/Data/DataPack";
import enUS from "antd/lib/locale/en_US";
import jaJP from "antd/lib/locale/ja_JP";

export default function Clock() {
   const locale = useTheme();
   if (!locale) return <></>;
   const { localeLang }: { localeLang: typeof jaJP | typeof enUS } = locale;
   const lang: string = localeLang.locale;

   const [date, setDate] = useState("Date...");
   const [time, setTime] = useState("Time...");

   const ClockFC = () => {
      const date: Date = new Date();
      let clockDate: string = "";
      let clockTime: string = "";
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
