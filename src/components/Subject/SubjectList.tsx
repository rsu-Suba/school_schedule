import { List } from "antd";
import "@/App.css";
import jsonData from "~/assets/main.json";
import jsonScheData from "~/assets/schedule.json";
import React, { useState, useEffect } from "react";
import { CardBase, CardInside, LoadSkeleton, SubList, SubIcon } from "@/components/Layout/CardComp";
import TimeListProp from "@/components/Subject/TimeListProp";
import { getSub } from "@/scripts/Server/api";
import PastTimeChecker from "@/scripts/Misc/pastTimeChecker";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import SubSelector from "@/scripts/Subject/subSelector";
import { isChangeToday } from "@/scripts/Subject/subChangeSupporter";
import useContexts from "@/scripts/Data/Contexts";
import IsExamDate from "@/scripts/Change/isExamDate";
import type { jsonTimeScheduleType, ScheduleJSON, GASArrayType } from "@/scripts/Data/type";

const jsonTimeSchedule: jsonTimeScheduleType = jsonData.time_schedule;
const jsonSche: ScheduleJSON = jsonScheData;

export default function SubjectList(props: { recentNum: number; nowtime: number; mode: string }) {
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   let cardtext: React.ReactNode[] = [];
   let nowTime: number = props.nowtime;
   const [fetchedData, setFetchedData] = useState<GASArrayType>([[["0", [[0, 0]]]], [["0", [["0", 0]]]]]);
   const [isFetching, setIsFetching] = useState<boolean>(false);
   const { isChanged, changeNum, day, isTomorrow, todaytext } = isChangeToday(fetchedData, nowTime, props);

   useEffect(() => {
      getSub(setFetchedData, setIsFetching);
   }, []);

   let timeList: number = 1;
   let loop: number = parseInt(jsonTimeSchedule[day].class.toString());
   if (loop == 5) {
      timeList = 2;
      loop--;
   }

   let irregular: number = 0;
   const SelectDate: string = getCustomDate(todaytext, "YYYYMMDD");
   if (props.mode === "main") {
      if (jsonSche[SelectDate] !== undefined) {
         irregular = jsonSche[SelectDate].irregular;
      }
   }
   if (
      day == 0 ||
      day == 6 ||
      (day === 5 && !isTomorrow && PastTimeChecker([timeList, loop], nowTime)) ||
      irregular == 1
   ) {
      cardtext.push(
         <SubList>
            <h4>
               {CardInsideContexts.Holiday}
               {irregular == 1 && ` | ${jsonSche[SelectDate].schedule[0]}`}
            </h4>
         </SubList>
      );
   } else if (irregular == 2) {
      cardtext.push(
         <SubList>
            <h4>{jsonSche[SelectDate].schedule[0]}</h4>
         </SubList>
      );
   } else {
      for (let i = 0; i < loop; i++) {
         let timeSelector: number = i + 1;
         if (!isTomorrow && PastTimeChecker([timeList, timeSelector], nowTime)) {
            continue;
         } else {
            const SubData: { SubNumber: number; loop: number } = SubSelector(
               day,
               timeSelector,
               isChanged,
               props.mode,
               todaytext,
               loop,
               fetchedData,
               changeNum
            );
            const SubNumber = SubData.SubNumber;
            loop = SubData.loop;
            if (props.mode === "main") {
               const datetext: string = getCustomDate(todaytext, "YYYYMMDD");
               const IsExamDatePack = IsExamDate(datetext);
               if (IsExamDatePack.TestStrNum !== -1) {
                  timeList = 3;
                  timeSelector = fetchedData[0][changeNum][1][i][0];
               }
            }
            cardtext.push(
               <SubList key={`${SubNumber}-${timeSelector}-${i}`} SubNumber={SubNumber}>
                  <SubIcon SubNumber={SubNumber} />
                  <List.Item.Meta
                     title={<TimeListProp text="title" SubNumber={SubNumber} timeSelector={[timeList, timeSelector]} />}
                     description={<TimeListProp text="desc" SubNumber={SubNumber} isTomorrow={isTomorrow} />}
                  />
               </SubList>
            );
         }
      }
   }

   if (props.mode == "main") {
      return (
         <CardBase title={CardTitleContexts.SubjectList_Main}>
            <CardInside>{isFetching ? <LoadSkeleton /> : <React.Fragment>{cardtext}</React.Fragment>}</CardInside>
         </CardBase>
      );
   } else if (props.mode == "module") {
      return <div id="card">{cardtext}</div>;
   }
}
