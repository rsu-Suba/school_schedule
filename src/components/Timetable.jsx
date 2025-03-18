import React from "react";
import SubjectList from "@/components/SubjectList";
import { Tabs } from "antd";
import { CardBase, CardInside } from "@/components/CardComp";
import useContexts from "@/scripts/Contexts";
const label = ["Mon", "Tue", "Wed", "Thu", "Fri"];
let items = [];
for (let i = 1; i <= 5; i++) {
   items.push({
      key: `${i}`,
      label: `${label[i - 1]}`,
      children: <SubjectList key={`card${i}`} num={i} mode={"module"} />,
   });
}

export default function Timetable(props) {
   const { CardTitleContexts } = useContexts();

   return (
      <CardBase title={CardTitleContexts.SubjectList_Module}>
         <CardInside>
            <Tabs defaultActiveKey={String(props.num)} items={items} />
         </CardInside>
      </CardBase>
   );
}
