import React from "react";
import SubjectList from "@/components/Subject/SubjectList";
import { Tabs } from "antd";
import { CardBase, CardInside } from "@/components/Layout/CardComp";
import useContexts from "@/scripts/Data/Contexts";

const label: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
let items: { key: string; label: string; children: React.ReactNode }[] = [];
for (let i = 1; i <= 5; i++) {
   items.push({
      key: `${i}`,
      label: `${label[i - 1]}`,
      children: <SubjectList recentNum={i} nowtime={900} mode={"module"} fetchedData={null} isLoading={false} />,
   });
}


export default function Timetable(props: { num: number }) {
   const { CardTitleContexts } = useContexts();
   return (
      <CardBase title={CardTitleContexts.SubjectList_Module}>
         <CardInside>
            <Tabs defaultActiveKey={String(props.num)} items={items}/>
         </CardInside>
      </CardBase>
   );
}
