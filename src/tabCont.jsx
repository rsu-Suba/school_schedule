import React, { useState, useEffect } from "react";
import Swipe from "./swipe";
import Bottom from "./bottom.jsx";
import Tabselect from "./tabselect";

export default function TabCont() {
   const [value, setValue] = useState(0);
   let tabNum = 0;
   let count = 0;

   const change = (data) => {
    console.log(`---${count}---`);
    console.log(`Plus${data}`);
      tabNum += data;
      if (tabNum < 0) tabNum = 0;
      if (tabNum > 2) tabNum = 2;
      setValue(tabNum);
      console.log(`Now${tabNum}`);
      Tabselect(tabNum);
      count++;
   };
   return (
      <>
         <Swipe handleValueChange={change} tab={value} />
         <Bottom handleValueChange={change} tab={value} />
      </>
   );
}
