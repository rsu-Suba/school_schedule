import json from "@/assets/main.json";
import { testDates } from "@/scripts/DataPack";

export default function SubSelector(day, timeSelector, isChanged, mode, todaytext, loop, fetchedData, changeNum) {
   let SubNumber = json[day][timeSelector];
   if (isChanged && mode === "main") {
      if (testDates.indexOf(todaytext) != -1) {
         loop = fetchedData[0][changeNum][1].length;
      }
      for (let n = 0; n < loop; n++) {
         const changeSubData = fetchedData[0][changeNum][1][n];
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
