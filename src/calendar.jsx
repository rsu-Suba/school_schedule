import * as React from "react";
import dayjs from "dayjs";
import { Calendar, List, Badge } from "antd";
import json from "./assets/schedule.json";

let dates = [];
let datesFull = [];
let sches = [];
let cardtext = [];
let cardtextContainer = [];
let selectScheContainer = [];

function calendarSelect(date) {
   dates = [];
   datesFull = [];
   sches = [];
   for (let i = 1; i <= date.daysInMonth(); i++) {
      let datetext = `${date.$y}${String(date.$M + 1).padStart(2, "0")}${String(i).padStart(2, "0")}`;
      if (json[datetext] === undefined) {
         continue;
      } else {
         dates.push(i);
         datesFull.push(`${datetext.slice(4, 6)}/${datetext.slice(6, 8)}/${datetext.slice(0, 4)}`);
         sches.push(json[datetext].schedule);
      }
   }
}

function dateSelect(date) {
   selectScheContainer = [];
   let selectSche;
   let datetext = `${date.$y}${String(date.$M + 1).padStart(2, "0")}${String(date.$D).padStart(2, "0")}`;
   if (json[datetext] === undefined) {
   } else {
      selectSche = json[datetext].schedule;
   }
   let cardtext = [];
   if (selectSche === undefined) {
      cardtext.push(
         <div className="undefinedCard">
            <p>予定なし</p>
         </div>
      );
   } else {
      cardtext.push(<div className="scheCard">{selectSche}</div>);
   }
   selectScheContainer.push(
      <div className="carddiv">
         <div className="cardTitle">
            <p className="cardtex">
               <span style={{ color: "#1677ff" }}>
                  {`${String(date.$M + 1)}/${String(date.$D)}/${date.$y}`.slice(0, 1)}
               </span>
               <span>{`${String(date.$M + 1)}/${String(date.$D)}/${date.$y}`.slice(1)}</span>
            </p>
         </div>
         <div className="card scheCard">
            <List className="scheCardContent">
               <List.Item>{cardtext}</List.Item>
            </List>
         </div>
      </div>
   );
   return selectScheContainer;
}

function fakeFetch(date, { signal }) {
   return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
         calendarSelect(date);
         const daysToHighlight = dates.map((date) => date);

         let scheContext = "";
         let scheDate = "";
         let dayNum = 0;
         let dayNumCache = 0;
         let dayNumFirst = 0;
         cardtext = [];
         cardtextContainer = [];
         for (let i = 0; i < dates.length; i++) {
            scheContext = `${sches[i]}`;
            scheDate = `${datesFull[i]}`;
            let weekDate = `${datesFull[i].slice(6, 10)}${datesFull[i].slice(0, 2)}${datesFull[i].slice(3, 5)}`;
            dayNum = Math.floor((Number(weekDate.slice(6, 8)) + dayjs(weekDate).startOf("month").day() + 6) / 7);

            if (scheDate.slice(3, 4) == "0") {
               scheDate = `${scheDate.slice(0, 3)}${scheDate.slice(4, 10)}`;
            }
            if (scheDate.slice(0, 1) == "0") {
               scheDate = `${scheDate.slice(1, 10)}`;
            }
            let scheCard = (
               <List className="scheCardContent">
                  <List.Item>
                     <div className="subProp">
                        <p className="scheText">{scheContext}</p>
                        <p className="scheText">{scheDate}</p>
                     </div>
                  </List.Item>
               </List>
            );
            if (dayNum != dayNumCache && dayNumFirst == 1) {
               let cardtextLength = cardtext.length;
               if (cardtextLength != 1) {
                  for (let n = 1; n < cardtextLength; n++) {
                     cardtext.splice(n * 2 - 1, 0, <div className="scheList"></div>);
                  }
               }
               cardtextContainer.push(<div className="card scheCard">{cardtext}</div>);
               cardtext = [];
               cardtext.push(scheCard);
            } else if (dayNum == dayNumCache || dayNumFirst == 0) {
               cardtext.push(scheCard);
            }
            if (dayNumFirst == 0) {
               dayNumFirst = 1;
            }
            if (i == dates.length - 1) {
               let cardtextLength = cardtext.length;
               if (cardtextLength != 1) {
                  for (let n = 1; n < cardtextLength; n++) {
                     cardtext.splice(n * 2 - 1, 0, <div className="scheList"></div>);
                  }
               }
               cardtextContainer.push(<div className="card scheCard">{cardtext}</div>);
               cardtext = [];
            }
            dayNumCache = dayNum;
         }

         resolve({ daysToHighlight });
      }, 500);

      signal.onabort = () => {
         clearTimeout(timeout);
         reject(new DOMException("aborted", "AbortError"));
      };
   });
}

const initialValue = dayjs();
let dateValue = dayjs();

export default function DateCalendarServerRequest() {
   const requestAbortController = React.useRef(null);
   const [isLoading, setIsLoading] = React.useState(false);
   const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
   const [today, setToday] = React.useState();

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
      setHighlightedDays([]);
      dateChange(date);
   };

   const dateChange = (date) => {
      let selectDate = date;
      if (dayjs(date).isBefore(dayjs()) == true) {
         selectDate = dayjs();
      }
      dateValue = selectDate;
      dateSelect(selectDate);
      fetchHighlightedDays(selectDate);
      setToday(date);
      dateCellRender(date);
   };

   const dateCellRender = (value) => {
      const day = value.date();
      const outsideCurrentMonth = dayjs(today).month();
      const isSelected = outsideCurrentMonth == value.month() && highlightedDays.indexOf(day) >= 0 ? true : false;
      const isToday = dayjs(`${value.year()}-${value.month() + 1}-${value.date()}`).isSame(
         `${dayjs(today).year()}-${dayjs(today).month() + 1}-${dayjs(today).date()}`
      );
      const isThisMonth = dayjs(value).isBefore(dayjs());
      if (isSelected || isToday) {
         return (
            <div>
               <Badge count={isSelected ? " " : null} size="small" color="blue">
                  <div
                     style={isThisMonth && !isToday ? { color: "rgba(0, 0, 0, 0.25" } : {}}
                     className="ant-picker-cell-inner"
                  >
                     {day}
                  </div>
               </Badge>
            </div>
         );
      } else {
         return (
            <div>
               <div className="ant-picker-cell-inner">{day}</div>
            </div>
         );
      }
   };

   return (
      <div className="scheDiv">
         <Calendar
            dateFullCellRender={dateCellRender}
            className="carddiv"
            fullscreen={false}
            views={["day"]}
            validRange={[dayjs().subtract(1, "day"), dayjs("2025-03-31")]}
            defaultValue={initialValue}
            value={dateValue}
            loading={isLoading}
            onPanelChange={handleMonthChange}
            onChange={(newValue) => dateChange(newValue)}
         />
         {selectScheContainer}
         <div className="carddiv cardLast" key={"calendarkey"}>
            {cardtextContainer}
         </div>
      </div>
   );
}
