import dayjs, { Dayjs } from "dayjs";
import jsonData from "@/assets/schedule.json";
import type { ScheduleJSON } from "@/scripts/Data/type";
const json: ScheduleJSON = jsonData;

function getWeekNumber(datesFull: string[], i: number) {
   let weekDate: string = `${datesFull[i].slice(6, 10)}${datesFull[i].slice(0, 2)}${datesFull[i].slice(3, 5)}`;
   let dayNum: number = Math.floor((Number(weekDate.slice(6, 8)) + dayjs(weekDate).startOf("month").day() + 6) / 7);

   return dayNum;
}

function getScheProps(date: Dayjs) {
   let dates: number[] = [];
   let datesSches: number[] = [];
   let datesFull: string[] = [];
   let sches: string[] = [];
   for (let i = 1; i <= date.daysInMonth(); i++) {
      let datetext: string = `${date.year()}${String(date.month() + 1).padStart(2, "0")}${String(i).padStart(2, "0")}`;
      if (json[datetext] !== undefined) {
         dates.push(i);
         datesSches.push(json[datetext].schedule.length);
         datesFull.push(`${datetext.slice(4, 6)}/${datetext.slice(6, 8)}/${datetext.slice(0, 4)}`);
         for (let j = 0; j < json[datetext].schedule.length; j++) {
            sches.push(json[datetext].schedule[j]);
         }
      }
   }

   return { dates, datesSches, datesFull, sches };
}

export { getWeekNumber, getScheProps };
