import React from "react";
import { List, Avatar, Skeleton } from "antd";
import jsonData from "~/assets/main.json";
import IconProvider from "@/components/Misc/iconProvider";
import { SubChangeSupporter } from "@/scripts/Subject/subChangeSupporter";
import type { jsonType, jsonTimeScheduleType } from "@/scripts/Data/type";

const jsonTimeSchedule: jsonTimeScheduleType = jsonData.time_schedule;
const jsonSub: jsonType = jsonData.sub;
const jsonTime: jsonType = jsonData.time;

function CardBase(props: { title: string; children: React.ReactNode }) {
   return (
      <div className="carddiv">
         <CardTitle title={props.title} />
         {props.children}
      </div>
   );
}

function CardTitle(props: { title: string }) {
   return (
      <div className="cardTitle">
         <p className="cardtex">
            <span style={{ color: "var(--main-color)" }}>{props.title.slice(0, 1)}</span>
            <span>{props.title.slice(1)}</span>
         </p>
      </div>
   );
}

function LoadSkeleton(props: { className?: string }) {
   return (
      <List className={`${props.className}`}>
         <List.Item>
            <Skeleton active round paragraph={{ rows: 2 }} title={false} />
         </List.Item>
      </List>
   );
}

function SubList(props: { day?: number; timeSelector?: number; children: React.ReactNode }) {
   let link: React.ReactNode = [];
   if (props.day != undefined && props.timeSelector != undefined) {
      link = (
         <a
            className="linkButton"
            href={jsonSub[jsonTimeSchedule[props.day][props.timeSelector]].syllabus}
            target="_blank"
         ></a>
      );
   }

   return (
      <List>
         <List.Item>{props.children}</List.Item>
         {link}
      </List>
   );
}

function CardInside(props: { className?: string; children: React.ReactNode }) {
   return (
      <div className={`card ${props.className || ""}`} id="card">
         {props.children}
      </div>
   );
}

function TimeListProp(props: { text: string; SubNumber: number; timeSelector?: number[] }) {
   const SupportData: { subName: string; textbook: string } = SubChangeSupporter(props);
   if (props.text == "title") {
      const time: string = jsonTime[props.timeSelector![0]][props.timeSelector![1]];
      return (
         <div className="subProp">
            <p className="subName">{SupportData.subName}</p>
            <p className="time">{time}</p>
         </div>
      );
   } else {
      return (
         <p className="textbook" style={{ color: "rgba(0, 0, 0, 0.65" }}>
            {SupportData.textbook}
         </p>
      );
   }
}

function SubIcon(props: { SubNumber: number }) {
   return (
      <Avatar>
         <IconProvider icon={jsonSub[props.SubNumber].icon} />
      </Avatar>
   );
}

export { CardBase, CardInside, LoadSkeleton, SubList, TimeListProp, SubIcon };
