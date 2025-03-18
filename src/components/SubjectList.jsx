import { List } from "antd";
import "@/App.css";
import json from "@/assets/main.json";
import React, { useState, useEffect } from "react";
import { CardBase, CardInside, LoadSkeleton, SubList, TimeListProp, SubIcon } from "@/components/CardComp";
import { getSub } from "@/scripts/api";
import PastTimeChecker from "@/scripts/pastTimeChecker";
import SubSelector from "@/scripts/subSelector";
import { isChangeToday } from "@/scripts/subChangeSupporter";
import useContexts from "@/scripts/Contexts";

export default function SubjectList(props) {
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   let cardtext = [];
   let nowTime = Number(props.nowtime);
   const [fetchedData, setFetchedData] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const { isChanged, changeNum, day, isTomorrow, todaytext } = isChangeToday(fetchedData, nowTime, props);

   useEffect(() => {
      getSub(setFetchedData, setIsFetching);
   }, []);

   let timeList = 1;
   let loop = json[day].class;
   if (loop == 5) {
      timeList = 2;
      loop--;
   }
   if (day == 0 || day == 6) {
      cardtext.push(<h4>{CardInsideContexts.Holiday}</h4>);
   } else {
      for (let i = 0; i < loop; i++) {
         let timeSelector = i + 1;
         if (!isTomorrow && PastTimeChecker([timeList, timeSelector], nowTime)) {
            continue;
         } else {
            const SubData = SubSelector(
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
               <SubList day={day} timeSelector={timeSelector}>
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
            <CardInside>{isFetching ? <LoadSkeleton /> : <>{cardtext}</>}</CardInside>
         </CardBase>
      );
   } else if (props.mode == "module") {
      return (
         <div id="card" key={props.key}>
            {cardtext}
         </div>
      );
   }
}
