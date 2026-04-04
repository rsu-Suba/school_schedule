import dayjs, { Dayjs } from "dayjs";
import { NewScheduleData, DayStatus, ScheduleEvent, SchedulePeriod, ScheduleOverride } from "./type";

export const isDateInPeriod = (date: Dayjs, period: SchedulePeriod): boolean => {
   const d = date.startOf("day");
   const start = dayjs(period.start).startOf("day");
   const end = dayjs(period.end).endOf("day");
   return (d.isAfter(start) || d.isSame(start)) && (d.isBefore(end) || d.isSame(end));
};

export const getDayStatus = (date: Dayjs, data: NewScheduleData): DayStatus => {
   const dateStr = date.format("YYYYMMDD");
   const dayOfWeek = date.day();
   const override: ScheduleOverride | undefined = data.overrides[dateStr];
   const appliedDay = override ? override.asDay : dayOfWeek;
   const label = override?.label;
   const activePeriod = data.periods.find((p) => isDateInPeriod(date, p));
   const dayEvents: ScheduleEvent[] = data.events[dateStr] || [];

   let isHoliday = false;
   if (dayEvents.some((e) => e.type === "holiday")) {
      isHoliday = true;
   } else if (activePeriod?.type === "holiday") {
      isHoliday = true;
   } else if (!override && (dayOfWeek === 0 || dayOfWeek === 6)) {
      isHoliday = true;
   }

   return {
      date: dateStr,
      appliedDay,
      label,
      isHoliday,
      events: dayEvents,
      periodName: activePeriod?.name,
   };
};
