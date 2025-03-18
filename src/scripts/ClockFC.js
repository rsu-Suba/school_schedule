import { useTheme } from "@/ThemeContext";

export default function ClockFC() {
   const { localeLang } = useTheme();
   let lang = localeLang.locale;
   console.log(lang);
   const date = new Date();
   const weekday = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"];
   let clockTime;
   let clockDate;

   if (lang == "en") {
      clockDate = `${weekday[date.getDay()]}day, 
      ${new Intl.DateTimeFormat("en", { month: "long" }).format(date)} 
      ${date.getDate()}`;
   } else {
      clockDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} (${weekday[date.getDay()]})`;
   }
   clockTime = `${String(date.getHours())}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
   ).padStart(2, "0")}`;

   const returnPack = { clockDate: clockDate, clockTime: clockTime };

   return returnPack;
}
