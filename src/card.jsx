import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import "./App.css";
import json from "./assets/main.json";
import Iconselect from "./iconselect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function card(props) {
   let cardtext = [];
   let timeList = 1;
   let loop = json[props.num].class;
   if (json[props.num].class == 5) timeList = 2;
   if (json[props.num].class == 5) loop--;


   let nowTime = Number(props.nowtime);
   for (let i = 1; i <= loop; i++) {
      let link = <a className="linkButton" href={json.sub[json[props.num][i]].syllabus} target="_blank"></a>;
      if (json.sub[json[props.num][i]].syllabus === "") {
         link = "";
      }
      if (props.pos == "top") {
         let classTime = Number(`${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`);
         if (`${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`.slice(0, 1) == "~") {
            classTime = `${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`.slice(-3);
         }
         if (classTime < nowTime) {
            continue;
         } else {
            cardtext.push(
               <List>
                  <ListItem>
                     <ListItemAvatar>
                        <Avatar>
                           <Iconselect icon={json.sub[json[props.num][i]].icon} />
                        </Avatar>
                     </ListItemAvatar>
                     <div className="cardRight">
                        <div className="subProp">
                           <p className="subName">{json.sub[json[props.num][i]].sub}</p>
                           <p className="time">{json.time[timeList][i]}</p>
                        </div>
                        <p className="textbook">{json.sub[json[props.num][i]].textbook}</p>
                     </div>
                     <ListItemText />
                     {link}
                  </ListItem>
               </List>
            );
         }
      } else {
         cardtext.push(
            <List>
               <ListItem>
                  <ListItemAvatar>
                     <Avatar>
                        <Iconselect icon={json.sub[json[props.num][i]].icon} />
                     </Avatar>
                  </ListItemAvatar>
                  <div className="cardRight">
                     <div className="subProp">
                        <p className="subName">{json.sub[json[props.num][i]].sub}</p>
                        <p className="time">{json.time[timeList][i]}</p>
                     </div>
                     <p className="textbook">{json.sub[json[props.num][i]].textbook}</p>
                  </div>
                  <ListItemText />
                  {link}
               </ListItem>
            </List>
         );
      }
   }
   if (cardtext.length == 0) {
      let day = props.num;
      if (((props.num == 0 || props.num == 6) && nowTime > 1600) || (props.num != 0 && props.num != 6)) {
         day++;
      }
      if (day == 7) {
         day = 0;
      }
      if (day == 0 || day == 6) {
         cardtext.push(<h4>休み</h4>);
      } else {
         let loop = json[day].class;
         if (json[day].class == 5) timeList = 2;
         if (json[day].class == 5) loop--;
         for (let m = 1; m <= loop; m++) {
            console.log(json[day][m]);
            let link = <a className="linkButton" href={json.sub[json[day][m]].syllabus} target="_blank"></a>;
            if (json[day][m].syllabus === "") {
               link = "";
            }
            cardtext.push(
               <List>
                  <ListItem>
                     <ListItemAvatar>
                        <Avatar>
                           <Iconselect icon={json.sub[json[day][m]].icon} />
                        </Avatar>
                     </ListItemAvatar>
                     <div className="cardRight">
                        <div className="subProp">
                           <p className="subName">{json.sub[json[day][m]].sub}</p>
                           <p className="time">{json.time[timeList][m]}</p>
                        </div>
                        <p className="textbook">{json.sub[json[day][m]].textbook}</p>
                     </div>
                     <ListItemText />
                     {link}
                  </ListItem>
               </List>
            );
         }
      }
   }

      return (
         <div className="carddiv">
            <p className="cardtex">{props.card}</p>
            <div className="card" id="card" key={props.key}>
               {cardtext}
            </div>
         </div>
      )
   }