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
   let SubNumber: number = parseInt(json[String(day)][String(timeSelector)].toString());
   if (isChanged && mode === "main") {
      const customDate: string = getCustomDate(todaytext, "YYYYMMDD");
      if (IsExamDate(customDate).TestStrNum != -1) {
         loop = fetchedData[0][changeNum][1].length;
      }
      for (let n = 0; n < loop; n++) {
         const changeSubData: number[] = fetchedData[0][changeNum][1][n];
         if (changeSubData != undefined && changeSubData[0] == timeSelector) {
            SubNumber = changeSubData[1];
         }
      }
   }

   const SubData = {
      SubNumber: SubNumber,
      loop: loop,
   };

   return SubData;
}
