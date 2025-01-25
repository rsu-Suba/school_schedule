import { Divider, List, Typography, Avatar, Button, Tour, Skeleton } from "antd";
import "./App.css";
import json from "./assets/main.json";
import Iconselect from "./iconselect";
import React, { useState, useEffect } from "react";
import { fetchData } from "./changeGet";

export default function Card(props) {
   let isChanged = false;
   let isTomorrow = false;
   let changeNum = 0;
   let changeCount = 0;
   let todaytext = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`;
   const [fetchedData, setFetchedData] = useState([]);
   const [isFetching, setIsFetching] = useState(false);
   const testDates = ["2025/01/30", "2025/01/31", "2025/02/03", "2025/02/04", "2025/02/05", "2025/02/06"];

   let nowTime = Number(props.nowtime);

   const get = () => {
      setIsFetching(true);
      const options = {
         method: "GET",
      };
      fetchData(options)
         .then((fetchedData) => {
            setFetchedData(fetchedData);
            setIsFetching(false);
         })
         .catch((err) => {
            console.log(err);
            setIsFetching(false);
         });
   };

   const calcDay = () => {
      let day = props.num;
      if (props.mode == "main") {
         if (nowTime > 1600) {
            day++;
            isTomorrow = true;
            todaytext = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate() + 1}`;
            //todaytext = `2025/02/03`;
         }
         if (day == 7) {
            day = 0;
         }
      }

      return day;
   };
   let day = calcDay();

   useEffect(() => {
      get();
   }, []);
   if (fetchedData[0]) {
      let fetchedDataDates = fetchedData[0].map(function (item) {
         return new Date(item[0]).getTime();
      });
      if (fetchedDataDates.indexOf(new Date(todaytext).getTime()) != -1) {
         isChanged = true;
         changeNum = fetchedDataDates.indexOf(new Date(todaytext).getTime());
      }
   }

   let cardtext = [];
   let timeList = 1;
   let loop = json[day].class;
   if (json[day].class == 5) timeList = 2;
   if (json[day].class == 5) loop--;
   for (let j = 0; j < loop; j++) {
      let i = j + 1;
      let link = <a className="linkButton" href={json.sub[json[day][i]].syllabus} target="_blank"></a>;
      if (json.sub[json[day][i]].syllabus === "") {
         link = "";
      }
      let classTime = Number(`${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`);
      if (`${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`.slice(0, 1) == "~") {
         classTime = `${json.time[timeList][i].slice(-5, -3)}${json.time[timeList][i].slice(-2)}`.slice(-3);
      }
      if (!isTomorrow && classTime < nowTime) {
         continue;
      } else {
         let iconStr = json[day][i];
         let subNameStr = json[day][i];
         let textbookStr = json[day][i];
         if (isChanged) {
            if (testDates.indexOf(todaytext) != -1) loop = fetchedData[0][changeNum][1].length;
            for (let n = 0; n < loop; n++) {
               if (fetchedData[0][changeNum][1][n] == undefined) continue;
               if (fetchedData[0][changeNum][1][n][0] == i && props.mode == "main") {
                  iconStr = fetchedData[0][changeNum][1][n][1];
                  subNameStr = fetchedData[0][changeNum][1][n][1];
                  textbookStr = fetchedData[0][changeNum][1][n][1];
               }
            }
         }
         cardtext.push(
            <List>
               <List.Item>
                  <Avatar>
                     <Iconselect icon={json.sub[iconStr].icon} />
                  </Avatar>
                  <List.Item.Meta
                     title={
                        <div className="subProp">
                           <p className="subName">
                              {json.sub[subNameStr].sub}
                              {testDates.indexOf(todaytext) != -1 ? " (学年末テスト)" : ""}
                           </p>
                           <p className="time">{json.time[timeList][i]}</p>
                        </div>
                     }
                     description={
                        <p className="textbook" style={{ color: "rgba(0, 0, 0, 0.65" }}>
                           {json.sub[textbookStr].textbook}
                        </p>
                     }
                  />
               </List.Item>
               {link}
            </List>
         );
      }
   }
   if (cardtext.length == 0) {
      if (day == 0 || day == 6) {
         cardtext.push(<h4>休み</h4>);
      } else {
         let loop = json[day].class;
         if (json[day].class == 5) timeList = 2;
         if (json[day].class == 5) loop--;
         for (let m = 1; m <= loop; m++) {
            let link = <a className="linkButton" href={json.sub[json[day][m]].syllabus} target="_blank"></a>;
            if (json[day][m].syllabus === "") {
               link = "";
            }
            cardtext.push(
               <List>
                  <List.Item>
                     <Avatar>
                        <Iconselect icon={json.sub[json[day][m]].icon} />
                     </Avatar>
                     <List.Item.Meta
                        title={
                           <div className="subProp">
                              <p className="subName">{json.sub[json[day][m]].sub}</p>
                              <p className="time">{json.time[timeList][m]}</p>
                           </div>
                        }
                        description={
                           <p className="textbook" style={{ color: "rgba(0, 0, 0, 0.65" }}>
                              {json.sub[json[day][m]].textbook}
                           </p>
                        }
                     />
                  </List.Item>
                  {link}
               </List>
            );
         }
      }
   }
   if (props.mode == "main") {
      return (
         <div className="carddiv">
            <div className="cardTitle">
               <p className="cardtex">
                  <span style={{ color: "var(--main-color)" }}>{props.card.slice(0, 1)}</span>
                  <span>{props.card.slice(1)}</span>
               </p>
            </div>
            <div className="card" id="card" key={props.key}>
               {isFetching ? (
                  <List>
                     <List.Item>
                        <Skeleton active round paragraph={{ rows: 2 }} title={false} />
                     </List.Item>
                  </List>
               ) : (
                  <>{cardtext}</>
               )}
            </div>
         </div>
      );
   } else if (props.mode == "module") {
      return (
         <div id="card" key={props.key}>
            {cardtext}
         </div>
      );
   }
}
