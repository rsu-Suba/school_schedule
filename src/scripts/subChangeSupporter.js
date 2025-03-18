import json from "@/assets/main.json";
import getTodayDate from "@/scripts/getTodayDate";

function SubChangeSupporter(props) {
   const SubData = json.sub[props.SubNumber];
   const SupportData = {
      subName: SubData.sub,
      textbook: SubData.textbook,
   };

   return SupportData;
}

function isChangeToday(fetchedData, nowTime, props) {
   let isChanged = false;
   let changeNum = 0;
   let day = props.num;
   let isTomorrow = false;
   let todaytext = getTodayDate();
   if (props.mode == "main") {
      if (nowTime > 1600) {
         isTomorrow = true;
         todaytext = getTodayDate(1);
         day++;
      }
      if (day == 7) day = 0;
   }

   if (fetchedData[0]) {
      let fetchedDataDates = fetchedData[0].map(function (item) {
         return new Date(item[0]).getTime();
      });
      if (fetchedDataDates.indexOf(new Date(todaytext).getTime()) != -1) {
         isChanged = true;
         changeNum = fetchedDataDates.indexOf(new Date(todaytext).getTime());
      }
   }

   return { isChanged, changeNum, day, isTomorrow, todaytext } ;
}

export { SubChangeSupporter, isChangeToday };
