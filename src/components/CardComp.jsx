import React from "react";
import { List, Avatar, Skeleton } from "antd";
import json from "@/assets/main.json";
import IconProvider from "@/components/iconProvider";
import { SubChangeSupporter } from "@/scripts/subChangeSupporter";

function CardBase(props) {
   return (
      <div className="carddiv">
         <CardTitle title={props.title} />
         {props.children}
      </div>
   );
}

function CardTitle(props) {
   return (
      <div className="cardTitle">
         <p className="cardtex">
            <span style={{ color: "var(--main-color)" }}>{props.title.slice(0, 1)}</span>
            <span>{props.title.slice(1)}</span>
         </p>
      </div>
   );
}

function LoadSkeleton(props) {
   return (
      <List className={`${props.className}`}>
         <List.Item>
            <Skeleton active round paragraph={{ rows: 2 }} title={false} />
         </List.Item>
      </List>
   );
}

function SubList(props) {
   let link = "";
   if (props.day != undefined && props.timeSelector != undefined) {
      link = (
         <a className="linkButton" href={json.sub[json[props.day][props.timeSelector]].syllabus} target="_blank"></a>
      );
   }

   return (
      <List>
         <List.Item>{props.children}</List.Item>
         {link}
      </List>
   );
}

function CardInside(props) {
   return (
      <div className={`card ${props.className || ""}`} id="card">
         {props.children}
      </div>
   );
}

function TimeListProp(props) {
   const SupportData = SubChangeSupporter(props);
   if (props.text == "title") {
      const time = json.time[props.timeSelector[0]][props.timeSelector[1]];
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

function SubIcon(props) {
   return (
      <Avatar>
         <IconProvider icon={json.sub[props.SubNumber].icon} />
      </Avatar>
   );
}

export { CardBase, CardInside, LoadSkeleton, SubList, TimeListProp, SubIcon };
