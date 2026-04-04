import jsonData from "@/assets/schedule.json";
import type { NewScheduleData } from "@/scripts/Data/type";

const json: NewScheduleData = jsonData as unknown as NewScheduleData;

export default function IsExamDate(date: string) {
   let TestStrNum: number = -1;
   let resultStr: string = "";
   const dayEvents = json.events[date] || [];
   const examEvent = dayEvents.find(e => e.type === "exam");

   if (examEvent) {
      const TestStr: string[] = ["中間試験", "期末試験", "学年末試験"];
      for (let i = 0; i < 3; i++) {
         if (examEvent.name.includes(TestStr[i])) {
            TestStrNum = i;
            resultStr = TestStr[i];
            break;
         }
      }
      if (TestStrNum === -1) {
          resultStr = examEvent.name;
          TestStrNum = 0;
      }
   }
   return { TestStrNum, resultStr };
}
