import React from "react";
import { Tabs } from "antd";
import Card from "./card.jsx";
const onChange = (key) => {
};
const items = [
   {
      key: "1",
      label: "Mon",
      children: <Card key={"card4"} card={"test"} num={1} pos={"mid"} mode={"module"} />,
   },
   {
      key: "2",
      label: "Tue",
      children: <Card key={"card4"} card={"test"} num={2} pos={"mid"} mode={"module"} />,
   },
   {
      key: "3",
      label: "Wed",
      children: <Card key={"card4"} card={"test"} num={3} pos={"mid"} mode={"module"} />,
   },
   {
      key: "4",
      label: "Thu",
      children: <Card key={"card4"} card={"test"} num={4} pos={"mid"} mode={"module"} />,
   },
   {
      key: "5",
      label: "Fri",
      children: <Card key={"card4"} card={"test"} num={5} pos={"mid"} mode={"module"} />,
   },
];
export default function TabsCard(props) {
   return (
      <div className="carddiv">
         <div className="cardTitle">
            <p className="cardtex">
               <span style={{ color: "#1677ff" }}>T</span>
               <span>ime Table</span>
            </p>
         </div>
         <div className="card" id="card" style={{ padding: "5px" }}>
            <Tabs defaultActiveKey={String(props.num)} items={items} onChange={onChange} />
         </div>
      </div>
   );
}
