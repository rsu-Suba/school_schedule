import React from "react";
import dayjs from "dayjs";
import { Calendar, Badge } from "antd";
import { useTheme } from "@/ThemeContext";
import json from "@/assets/schedule.json";
import { CardBase, CardInside, SubList } from "@/components/CardComp";
import { getWeekNumber, getScheProps } from "@/scripts/CalendarFC";
import getCustomDate from "@/scripts/getCustomDate";
import useContexts from "@/scripts/Contexts";

const initialValue = dayjs();
let dateValue = dayjs();
let dates = [];
let datesFull = [];
let sches = [];
let cardtext = [];
let cardtextContainer = [];

function fakeFetch(date, { signal }) {
   return new Promise((resolve, reject) => {
      const scheProps = getScheProps(date);
      dates = scheProps.dates;
      datesFull = scheProps.datesFull;
      sches = scheProps.sches;
      const daysToHighlight = [...dates];
      let dayNumCache = 0;
      cardtext = [];
      cardtextContainer = [];

      for (let i = 0; i < dates.length; i++) {
         const dayNum = getWeekNumber(datesFull, i);
         if (dayNumCache != dayNum && dayNumCache != 0) {
            let cardtextLength = cardtext.length;
            for (let n = 1; n < cardtextLength; n++) {
               cardtext.splice(n % 2 != 0, 0, <div className="scheList"></div>);
            }
            cardtextContainer.push(<CardInside>{cardtext}</CardInside>);
            cardtext = [];
         }
         cardtext.push(
            <SubList>
               <div className="subProp">
                  <p className="scheText">{sches[i]}</p>
                  <p className="scheText">{datesFull[i].replace(/\/0(\d)/g, "/$1").replace(/^0/, "")}</p>
               </div>
            </SubList>
         );
         if (i == dates.length - 1) {
            cardtextContainer.push(<CardInside>{cardtext}</CardInside>);
         }
         dayNumCache = dayNum;
      }
      resolve({ daysToHighlight });
      signal.onabort = () => reject(new DOMException("aborted", "AbortError"));
   });
}

export default function DateCalendarServerRequest() {
   const requestAbortController = React.useRef(null);
   const [isLoading, setIsLoading] = React.useState(false);
   const [highlightedDays, setHighlightedDays] = React.useState([]);
   const [selectScheContainer, setSelectScheContainer] = React.useState([]);
   const [today, setToday] = React.useState();
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   const { primaryColor } = useTheme();

   const dateSelect = (date) => {
      let datetext = getCustomDate(date, "YYYYMMDD");
      const SelectDate = json[datetext];

      setSelectScheContainer(
         <CardBase title={`${getCustomDate(date, "MM/DD")}/${date.$y}`}>
            <CardInside>
               <SubList>
                  {SelectDate === undefined ? [CardInsideContexts.NoSchedule] : [SelectDate.schedule]}
               </SubList>
            </CardInside>
         </CardBase>
      );
   };

   const fetchHighlightedDays = (date) => {
      const controller = new AbortController();
      dateSelect(date);

      fakeFetch(date, {
         signal: controller.signal,
      })
         .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight);
            setIsLoading(false);
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

   const handleMonthChange = (date) => {
      if (requestAbortController.current) {
         requestAbortController.current.abort();
      }
      setIsLoading(true);
      dateChange(date);
   };

   const dateChange = (date) => {
      let selectDate = date;
      if (dayjs(date).isBefore(dayjs()) == true) {
         selectDate = dayjs();
      }
      dateValue = selectDate;
      fetchHighlightedDays(selectDate);
      setToday(date);
      dateCellRender(date);
   };

   const dateCellRender = (value) => {
      const day = value.date();
      const isSelected = dayjs(today).month() == value.month() && highlightedDays.indexOf(day) >= 0 ? true : false;
      const isToday = dayjs(`${value.year()}-${value.month() + 1}-${value.date()}`).isSame(
         `${dayjs(today).year()}-${dayjs(today).month() + 1}-${dayjs(today).date()}`
      );
      const isThisMonth = dayjs(value).isBefore(dayjs());
      if (isSelected || isToday) {
         return (
            <Badge count={isSelected ? " " : null} size="small" color={primaryColor}>
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
      <div className="scheDiv">
         <Calendar
            dateFullCellRender={dateCellRender}
            className="carddiv"
            fullscreen={false}
            views={["day"]}
            validRange={[dayjs().subtract(1, "day"), dayjs("2025-04-01")]}
            defaultValue={initialValue}
            value={dateValue}
            loading={isLoading}
            onPanelChange={handleMonthChange}
            onChange={(newValue) => dateChange(newValue)}
         />
         {selectScheContainer}
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
