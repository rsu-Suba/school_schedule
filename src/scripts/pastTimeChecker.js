import json from "@/assets/main.json";

export default function PastTimeChecker(timeSelector, nowTime) {
   let timeStr = json.time[timeSelector[0]][timeSelector[1]];
   let classTime = timeStr.slice(-5, -3) + timeStr.slice(-2);
   if (classTime.startsWith("~")) {
      classTime = classTime.slice(-3);
   }
   classTime = Number(classTime);

   if (classTime < nowTime) {
    return true;
   }
}
