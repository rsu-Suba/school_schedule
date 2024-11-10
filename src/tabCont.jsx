import React, { useState, useEffect } from "react";
import Swipe from "./swipe";
import Bottom from "./bottom.jsx";
import Tabselect from "./tabselect";

let tabNum = 0;
let count = 0;
export default function TabCont() {
   const [value, setValue] = useState(null);

   const change = (data) => {
      tabNum = Number(tabNum) + Number(data);
      if (tabNum < 0) tabNum = 0;
      if (tabNum > 2) tabNum = 2;
      //setValue(tabNum);
      Tabselect(tabNum);
      count++;
      setValue(Number(tabNum));
   };
   const changeBtn = (data) => {
      tabNum = Number(data);
      //setValue(tabNum);
      Tabselect(tabNum);
      count++;
      setValue(Number(tabNum));
   };
   return (
      <>
         <Swipe handleValueChange={change} tab={value} />
         <Bottom handleValueChange={changeBtn} tab={value} />
      </>
   );
}
