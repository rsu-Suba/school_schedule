import jsonData from "~/assets/main.json";
import { testDates } from "@/scripts/Data/DataPack";
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
      if (testDates.indexOf(todaytext) != -1) {
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
