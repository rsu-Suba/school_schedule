import dayjs from "dayjs";
import json from "@/assets/schedule.json";

function getWeekNumber(datesFull, i) {
   let weekDate = `${datesFull[i].slice(6, 10)}${datesFull[i].slice(0, 2)}${datesFull[i].slice(3, 5)}`;
   let dayNum = Math.floor((Number(weekDate.slice(6, 8)) + dayjs(weekDate).startOf("month").day() + 6) / 7);

   return dayNum;
}

function getScheProps(date) {
   let dates = [];
   let datesFull = [];
   let sches = [];
   for (let i = 1; i <= date.daysInMonth(); i++) {
      let datetext = `${date.$y}${String(date.$M + 1).padStart(2, "0")}${String(i).padStart(2, "0")}`;
      if (json[datetext] !== undefined) {
         dates.push(i);
         datesFull.push(`${datetext.slice(4, 6)}/${datetext.slice(6, 8)}/${datetext.slice(0, 4)}`);
         sches.push(json[datetext].schedule);
      }
   }

   return { dates, datesFull, sches };
}

export { getWeekNumber, getScheProps };
