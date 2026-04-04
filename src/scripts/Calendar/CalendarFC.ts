import { Dayjs } from "dayjs";
import jsonData from "@/assets/schedule.json";
import { NewScheduleData, DayStatus } from "@/scripts/Data/type";
import { getDayStatus } from "@/scripts/Data/ScheduleProcessor";

const json: NewScheduleData = jsonData as unknown as NewScheduleData;

export type MonthlyEvent = {
    date: Dayjs;
    status: DayStatus;
};

export function getMonthlyEvents(monthDate: Dayjs): MonthlyEvent[] {
    const events: MonthlyEvent[] = [];
    const startOfMonth = monthDate.startOf("month");
    const daysInMonth = monthDate.daysInMonth();

    for (let i = 1; i <= daysInMonth; i++) {
        const date = startOfMonth.date(i);
        const status = getDayStatus(date, json);
        const hasEvents = status.events.length > 0;
        const hasOverride = !!status.label;

        if (hasEvents || hasOverride) {
            events.push({ date, status });
        }
    }

    return events;
}

export function getWeekNumber(date: Dayjs) {
    return Math.floor((date.date() + date.startOf("month").day() + 6) / 7);
}
