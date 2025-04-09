import React, { useState, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Calendar, Badge } from "antd";
import type { CalendarProps } from "antd";
import { useTheme } from "@/ThemeContext";
import jsonData from "~/assets/schedule.json";
import { CardBase, CardInside, SubList, Divider } from "@/components/Layout/CardComp";
import { getWeekNumber, getScheProps } from "@/scripts/CalendarFC";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import useContexts from "@/scripts/Data/Contexts";
import type { ScheduleJSON } from "@/scripts/Data/type";

const json: ScheduleJSON = jsonData;

type ScheProps = {
   dates: number[];
   datesSches: number[];
   datesFull: string[];
   sches: string[];
};

type daysToHighlightType = {
   daysToHighlight: number[];
};

const initialValue: Dayjs = dayjs();
let dateValue: Dayjs = dayjs();
let cardtext: React.ReactNode[] = [];
let cardtextContainer: React.ReactNode[] = [];

function fakeFetch(date: Dayjs, signal: AbortSignal): Promise<daysToHighlightType> {
   return new Promise((resolve, reject) => {
      const { dates, datesSches, datesFull, sches }: ScheProps = getScheProps(date);
      const daysToHighlight: number[] = [...dates];
      let dayNumCache: number = 0;
      let index: number = 0;
      cardtext = [];
      cardtextContainer = [];
      for (let i = 0; i < dates.length; i++) {
         const schedCount = datesSches[i];
         for (let j = 0; j < schedCount; j++, index++) {
            const dayNum: number = getWeekNumber(datesFull, i);
            if (dayNumCache === dayNum) {
               cardtext.push(<Divider />);
            } else {
               if (index !== 0) {
                  cardtextContainer.push(<CardInside>{cardtext}</CardInside>);
                  cardtext = [];
               }
            }
            cardtext.push(
               <SubList key={index}>
                  <div className="subProp">
                     <p className="scheText">{sches[index]}</p>
                     <p className="scheText">{datesFull[i].replace(/\/0(\d)/g, "/$1").replace(/^0/, "")}</p>
                  </div>
               </SubList>
            );

            dayNumCache = dayNum;
            if (i === dates.length - 1 && j === schedCount - 1) {
               cardtextContainer.push(<CardInside>{cardtext}</CardInside>);
            }
         }
      }
      resolve({ daysToHighlight });
      signal.onabort = () => reject(new DOMException("aborted", "AbortError"));
   });
}

export default function DateCalendarServerRequest() {
   const requestAbortController = useRef<AbortController | null>(null);
   const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
   const [selectScheContainer, setSelectScheContainer] = useState<React.ReactNode[]>([]);
   const [today, setToday] = useState<string>();
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   const theme = useTheme();
   if (!theme) return <></>;
   const { primaryColor } = theme;

   const dateSelect = (date: Dayjs) => {
      let datetext: string = getCustomDate(String(date), "YYYYMMDD");
      const SelectDate: { schedule: string[] } | undefined = json[datetext];
      if (SelectDate === undefined) {
         setSelectScheContainer([
            <CardInside>
               <SubList>{CardInsideContexts.NoSchedule}</SubList>
            </CardInside>,
         ]);
      } else {
         setSelectScheContainer([
            <CardInside>
               {SelectDate.schedule.map((schedate: string, index: number) => (
                  <>
                     {index !== 0 && <Divider />}
                     <SubList>{schedate}</SubList>
                  </>
               ))}
            </CardInside>,
         ]);
      }
   };

   const fetchHighlightedDays = (date: Dayjs) => {
      const controller: AbortController = new AbortController();
      dateSelect(date);
      setHighlightedDays([]);
      fakeFetch(date, controller.signal)
         .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight);
         })
         .catch((error) => {
            if (error.name !== "AbortError") {
               throw error;
            }
         });

      requestAbortController.current = controller;
   };

   React.useEffect(() => {
      fetchHighlightedDays(initialValue);
      return () => requestAbortController.current?.abort();
   }, []);

   const handleMonthChange = (date: Dayjs, _mode: CalendarProps<Dayjs>["mode"]) => {
      if (requestAbortController.current) {
         requestAbortController.current.abort();
      }
      dateChange(date);
   };

   const dateChange = (date: Dayjs) => {
      let selectDate: Dayjs = date;
      if (dayjs(date).isBefore(dayjs()) == true) {
         selectDate = dayjs();
      }
      dateValue = selectDate;
      fetchHighlightedDays(selectDate);
      setToday(String(date));
      dateCellRender(date);
   };

   const dateCellRender = (value: Dayjs) => {
      const day: number = value.date();
      const isSelected: boolean =
         dayjs(today).month() == value.month() && highlightedDays.indexOf(day) >= 0 ? true : false;
      const isToday: boolean = dayjs(`${value.year()}-${value.month() + 1}-${value.date()}`).isSame(
         `${dayjs(today).year()}-${dayjs(today).month() + 1}-${dayjs(today).date()}`
      );
      const isThisMonth: boolean = dayjs(value).isBefore(dayjs());
      if (isSelected || isToday) {
         return (
            <Badge count={isSelected ? " " : null} size="small" color={String(primaryColor)}>
               <div
                  style={isThisMonth && !isToday ? { color: "var(--disable-day-color)" } : {}}
                  className="ant-picker-cell-inner"
               >
                  {day}
               </div>
            </Badge>
         );
      } else {
         return <div className="ant-picker-cell-inner">{day}</div>;
      }
   };

   return (
      <div className="scheCards">
         <Calendar
            dateFullCellRender={dateCellRender}
            className="carddiv"
            fullscreen={false}
            validRange={[dayjs().subtract(1, "day"), dayjs("2026-03-31")]}
            defaultValue={initialValue}
            value={dateValue}
            onPanelChange={handleMonthChange}
            onChange={(newValue) => dateChange(newValue)}
         />
         <CardBase title={`${getCustomDate(String(dateValue), "MM/DD")}/${dateValue.year()}`}>
            {selectScheContainer}
         </CardBase>
         <CardBase title={CardTitleContexts.Calendar_MonthlyList}>
            {cardtextContainer.length ? (
               cardtextContainer
            ) : (
               <CardInside>
                  <SubList>{CardInsideContexts.NoSchedule}</SubList>
               </CardInside>
            )}
         </CardBase>
      </div>
   );
}
