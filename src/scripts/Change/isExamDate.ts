import jsonData from "~/assets/schedule.json";
import type { ScheduleJSON } from "@/scripts/Data/type";

const json: ScheduleJSON = jsonData;

export default function IsExamDate(date: string) {
   let TestStrNum: number = -1;
   let resultStr: string = "";
   if (json[date] !== undefined) {
      const TestStr: string[] = ["中間試験", "期末試験", "学年末試験"];
      for (let i = 0; i < 3; i++) {
         const isTestDay = json[date].schedule[0].includes(TestStr[i]);
         if (isTestDay) {
            TestStrNum = i;
         }
      }

      if (TestStrNum !== -1) {
         resultStr = TestStr[TestStrNum];
      }
   }
   return { TestStrNum, resultStr };
}
