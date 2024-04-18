import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import "./App.css";
import json from "./assets/schedule.json";
import { DateCalendarServerRequest, dates } from "./calendar.jsx";

export default function card(props) {
   let timeList = 1;
   let loop = 1;
   let cardtext = [];
   let scheContext = "";
   let scheDate = "";
   console.log(dates, props.date);
   for (let i = 0; i < dates.length; i++) {
    cardtext.push(
     <List>
        <ListItem>
           <div className="cardRight">
              <p className="scheText">
                 {scheContext}&ensp;/&ensp;{scheDate}
              </p>
           </div>
           <ListItemText />
        </ListItem>
     </List>
     );
    }

   return (
      <div className="carddiv cardLast">
         <div className="card">
            {cardtext}
         </div>
      </div>
   );
}
