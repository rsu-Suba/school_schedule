import React, { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, Badge } from "antd";
import { useTheme } from "@/ThemeContext";
import jsonData from "@/assets/schedule.json";
import { CardBase, CardInside, SubList, Divider } from "@/components/Layout/CardComp";
import { getMonthlyEvents, getWeekNumber, MonthlyEvent } from "@/scripts/Calendar/CalendarFC";
import useContexts from "@/scripts/Data/Contexts";
import type { NewScheduleData } from "@/scripts/Data/type";
import { getDayStatus } from "@/scripts/Data/ScheduleProcessor";

const scheduleData: NewScheduleData = jsonData as unknown as NewScheduleData;

export default function DateCalendarServerRequest() {
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const { CardTitleContexts, CardInsideContexts } = useContexts();
    const theme = useTheme();

    if (!theme) return <></>;
    const { primaryColor } = theme;
    const monthlyEvents = useMemo(() => getMonthlyEvents(currentMonth), [currentMonth]);
    const selectedStatus = useMemo(() => getDayStatus(selectedDate, scheduleData), [selectedDate]);
    const highlightedDays = useMemo(() => monthlyEvents.map((e) => e.date.date()), [monthlyEvents]);

    const dateCellRender = (value: Dayjs) => {
        const day = value.date();
        const isSameMonth = value.month() === currentMonth.month();
        const isHighlighted = isSameMonth && highlightedDays.includes(day);
        const isToday = value.isSame(dayjs(), "day");
        const isPast = value.isBefore(dayjs(), "day");

        if (isHighlighted || isToday) {
            return (
                <Badge count={isHighlighted ? " " : null} size="small" color={String(primaryColor)}>
                    <div
                        style={isPast && !isToday ? { color: "var(--disable-day-color)" } : {}}
                        className="ant-picker-cell-inner"
                    >
                        {day}
                    </div>
                </Badge>
            );
        }
        return <div className="ant-picker-cell-inner">{day}</div>;
    };

    const handleDateChange = (date: Dayjs) => {
        setSelectedDate(date);
        if (date.month() !== currentMonth.month()) {
            setCurrentMonth(date);
        }
    };

    const handlePanelChange = (date: Dayjs) => {
        setCurrentMonth(date);
    };

    const renderMonthlyList = () => {
        if (monthlyEvents.length === 0) {
            return (
                <CardInside>
                    <SubList>{CardInsideContexts.NoSchedule}</SubList>
                </CardInside>
            );
        }

        const weeks: Record<number, MonthlyEvent[]> = {};
        monthlyEvents.forEach((event) => {
            const week = getWeekNumber(event.date);
            if (!weeks[week]) weeks[week] = [];
            weeks[week].push(event);
        });

        return Object.entries(weeks).map(([week, events]) => (
            <CardInside key={week}>
                {events.map((event, idx) => {
                    const displayEvents = event.status.events.filter((e) => e.name !== event.status.label);
                    return (
                        <React.Fragment key={event.date.format("YYYYMMDD")}>
                            {idx !== 0 && <Divider />}
                            <SubList>
                                <div className="subProp">
                                    <div>
                                        {displayEvents.map((e) => (
                                            <p key={e.name} className="scheText">
                                                {e.name}
                                            </p>
                                        ))}
                                        {event.status.label && (
                                            <p className="scheText" style={{ color: "var(--ant-primary-color)" }}>
                                                {event.status.label}
                                            </p>
                                        )}
                                        {!event.status.events.length &&
                                            !event.status.label &&
                                            event.status.periodName && (
                                                <p className="scheText">{event.status.periodName}</p>
                                            )}
                                    </div>
                                    <p className="scheText">{event.date.format("M/D")}</p>
                                </div>
                            </SubList>
                        </React.Fragment>
                    );
                })}
            </CardInside>
        ));
    };

    const renderSelectedDetail = () => {
        const displayEvents = selectedStatus.events.filter((e) => e.name !== selectedStatus.label);
        const hasContent = displayEvents.length > 0 || !!selectedStatus.label || !!selectedStatus.periodName;

        if (!hasContent) {
            return <SubList>{CardInsideContexts.NoSchedule}</SubList>;
        }

        return (
            <>
                {displayEvents.map((e, idx) => (
                    <React.Fragment key={idx}>
                        {idx !== 0 && <Divider />}
                        <SubList>{e.name}</SubList>
                    </React.Fragment>
                ))}
                {selectedStatus.label && (
                    <>
                        {displayEvents.length > 0 && <Divider />}
                        <SubList>
                            <span style={{ color: "var(--ant-primary-color)" }}>{selectedStatus.label}</span>
                        </SubList>
                    </>
                )}
                {selectedStatus.periodName && (
                    <>
                        {(displayEvents.length > 0 || !!selectedStatus.label) && <Divider />}
                        <SubList>{selectedStatus.periodName}</SubList>
                    </>
                )}
            </>
        );
    };

    return (
        <div className="scheCards">
            <Calendar
                dateFullCellRender={dateCellRender}
                className="carddiv"
                fullscreen={false}
                validRange={[dayjs().subtract(1, "day"), dayjs("2027-03-31")]}
                value={selectedDate}
                onPanelChange={handlePanelChange}
                onChange={handleDateChange}
            />

            <CardBase title={selectedDate.format("M/D/YYYY")}>
                <CardInside>{renderSelectedDetail()}</CardInside>
            </CardBase>

            <CardBase title={CardTitleContexts.Calendar_MonthlyList}>{renderMonthlyList()}</CardBase>
        </div>
    );
}
