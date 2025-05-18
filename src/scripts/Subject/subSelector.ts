import jsonData from "~/assets/main.json";
import IsExamDate from "@/scripts/Change/isExamDate";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import type { jsonTimeScheduleType, GASArrayType } from "@/scripts/Data/type";
const json: jsonTimeScheduleType = jsonData.time_schedule;

export default function SubSelector(
   day: number,
   timeSelector: number,
   isChanged: boolean,
   mode: string,
   todaytext: string,
   loop: number,
   fetchedData: GASArrayType,
   changeNum: number
) {
   let SubNumber: number = 1;
   if (json[String(day)][String(timeSelector)] !== undefined) {
      SubNumber = parseInt(json[String(day)][String(timeSelector)].toString());
   }
   if (isChanged && mode === "main") {
      const customDate: string = getCustomDate(todaytext, "YYYYMMDD");
      if (IsExamDate(customDate).TestStrNum != -1) {
         loop = fetchedData[0][changeNum][1].length;
      } else {
         for (let n = 0; n < fetchedData[0][changeNum][1].length; n++) {
            if (fetchedData[0][changeNum][1][n][0] > loop) {
               loop = fetchedData[0][changeNum][1][n][0];
               break;
            }
         }
      }
      for (let n = 0; n < loop; n++) {
         const changeSubData: number[] = fetchedData[0][changeNum][1][n];
         const changeTime = IsExamDate(customDate).TestStrNum != -1 ? n : changeSubData[0];
         if (IsExamDate(customDate).TestStrNum != -1) {
            timeSelector--;
         }
         if (changeSubData[0] != 0 && changeTime == timeSelector) {
            if (IsExamDate(customDate).TestStrNum != -1) {
               SubNumber = fetchedData[0][changeNum][1][n][1];
            } else {
               SubNumber = changeSubData[1];
            }
         }
      }
   }

   const SubData = {
      SubNumber: SubNumber,
      loop: loop,
   };

   return SubData;
}
