import { List } from "antd";
import "@/App.css";
import jsonData from "~/assets/main.json";
import React, { useState, useEffect } from "react";
import { CardBase, CardInside, LoadSkeleton, SubList, TimeListProp, SubIcon } from "@/components/Layout/CardComp";
import { getSub } from "@/scripts/Server/api";
import PastTimeChecker from "@/scripts/Misc/pastTimeChecker";
import SubSelector from "@/scripts/Subject/subSelector";
import { isChangeToday } from "@/scripts/Subject/subChangeSupporter";
import useContexts from "@/scripts/Data/Contexts";
import type { jsonTimeScheduleType, GASArrayType } from "@/scripts/Data/type";

const jsonTimeSchedule: jsonTimeScheduleType = jsonData.time_schedule;

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
   if (day == 0 || day == 6 || (day === 5 && PastTimeChecker([timeList, loop], nowTime))) {
      cardtext.push(<h4>{CardInsideContexts.Holiday}</h4>);
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

            cardtext.push(
               <SubList key={`${SubNumber}-${timeSelector}-${i}`} day={day} timeSelector={timeSelector}>
                  <SubIcon SubNumber={SubNumber} />
                  <List.Item.Meta
                     title={<TimeListProp text="title" SubNumber={SubNumber} timeSelector={[timeList, timeSelector]} />}
                     description={<TimeListProp text="desc" SubNumber={SubNumber} />}
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
