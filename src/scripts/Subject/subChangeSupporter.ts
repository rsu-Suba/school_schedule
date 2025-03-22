import jsonData from "~/assets/main.json";
import getTodayDate from "@/scripts/Misc/getTodayDate";
import type { jsonType, GASArrayType } from "@/scripts/Data/type";

const json: jsonType = jsonData.sub;

function SubChangeSupporter(props: { text: string; SubNumber: number; timeSelector?: number[] }) {
   const SubData = json[props.SubNumber];
   const SupportData = {
      subName: SubData.sub,
      textbook: SubData.textbook,
   };

   return SupportData;
}

function isChangeToday(
   fetchedData: GASArrayType,
   nowTime: number,
   props: { recentNum: number; nowtime: number; mode: string }
) {
   let isChanged: boolean = false;
   let changeNum: number = 0;
   let day: number = props.recentNum;
   let isTomorrow: boolean = false;
   let todaytext: string = getTodayDate();
   if (props.mode == "main") {
      if (nowTime > 1600) {
         isTomorrow = true;
         todaytext = getTodayDate(1);
         day!++;
      }
      if (day == 7) day = 0;
   }

   if (fetchedData[0]) {
      let fetchedDataDates: (Date | number | string)[] = fetchedData[0].map(function (item) {
         return new Date(item[0]).getTime();
      });
      if (fetchedDataDates.indexOf(new Date(todaytext).getTime()) != -1) {
         isChanged = true;
         changeNum = fetchedDataDates.indexOf(new Date(todaytext).getTime());
      }
   }

   return { isChanged, changeNum, day, isTomorrow, todaytext };
}

export { SubChangeSupporter, isChangeToday };
