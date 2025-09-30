import jsonData from "@/assets/main.json";
import type { jsonType } from "@/scripts/Data/type";

const json: jsonType = jsonData.time;

export default function PastTimeChecker(timeSelector: number[], nowTime: number) {
   let timeStr: string = json[timeSelector[0]][timeSelector[1]];
   let classTime: string = timeStr.slice(-5, -3) + timeStr.slice(-2);
   if (classTime.startsWith("~")) {
      classTime = classTime.slice(-3);
   }

   if (parseInt(classTime) < nowTime) {
      return true;
   }
}
