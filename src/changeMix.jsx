import React, { useState, useEffect } from "react";
import { fetchData } from "./changeGet";
import json from "./assets/main.json";
import DatePicker from "react-datepicker";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

let time = 1;
let sub = 1;
let timeWork = 1;

const ChangeMix = (props) => {
   const Today = new Date();
   const [data, setData] = useState([]);
   const [dataWork, setWorkData] = useState([]);
   const [dataWorkOpt, setWorkOpt] = useState([{ value: "0", label: "0" }]);
   const [isFetching, setIsFetching] = useState(false);
   const [isPosting, setIsPosting] = useState(false);
   const [isWorkPosting, setIsWorkPosting] = useState(false);
   const [textWork, setWorkText] = useState("");
   const [error, setError] = useState(null);
   const [timeWorkState, setTimeWorkState] = useState(0);
   const [date, setDate] = React.useState(Today);
   const times = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
   ];
   let works = [{ value: "0", label: "0" }];
   const subsListOpt = [
      { value: "1", label: "コンピューターシステムII" },
      { value: "2", label: "プログラミングII" },
      { value: "3", label: "化学IIB" },
      { value: "4", label: "微分積分学II" },
      { value: "5", label: "英会話II" },
      { value: "6", label: "総合英語II" },
      { value: "7", label: "英語表現II" },
      { value: "8", label: "基礎科学実験" },
      { value: "9", label: "総合国語IIB" },
      { value: "10", label: "体育II" },
      { value: "11", label: "基礎電気II" },
      { value: "12", label: "線形代数II" },
      { value: "13", label: "電子情報工学実験IIB" },
      { value: "14", label: "物理学IIB" },
      { value: "15", label: "歴史I" },
      { value: "16", label: "休み" },
      { value: "17", label: "その他" },
      { value: "18", label: "削除" },
   ];
   const subsList = [
      "コンピューターシステムII",
      "プログラミングII",
      "化学IIB",
      "微分積分学II",
      "英会話II",
      "総合英語II",
      "英語表現II",
      "基礎科学実験",
      "総合国語IIB",
      "体育II",
      "基礎電気II",
      "線形代数II",
      "電子情報工学実験IIB",
      "物理学IIB",
      "歴史I",
      "休み",
      "その他",
      "削除",
   ];

   const get = () => {
      setIsFetching(true);
      const options = {
         method: "GET",
      };
      const url = `https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec?sheetName=sheet1`;
      fetchData(url, options)
         .then((fetchedData) => {
            setData(fetchedData[0]);
            setWorkData(fetchedData[1]);
            homework(fetchedData[1]);
            setIsFetching(false);
         })
         .catch((err) => {
            setError("Failed to fetch data");
            setIsFetching(false);
         });
   };

   const post = (mode) => {
      const url =
         "https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec";
      let options = {};
      if (mode == 0) {
         setIsPosting(true);
         options = {
            method: "POST",
            body: JSON.stringify({
               date: document.getElementById("datepicker").value,
               time: time,
               value: sub,
            }),
         };
      } else if (mode == 1) {
         setIsWorkPosting(true);
         options = {
            method: "POST",
            body: JSON.stringify({
               date: document.getElementById("datepickerWork").value,
               time: 5,
               value: textWork,
            }),
         };
      } else if (mode == 2) {
         setIsWorkPosting(true);
         options = {
            method: "POST",
            body: JSON.stringify({
               date: 0,
               time: 5,
               value: timeWorkState,
            }),
         };
      }
      fetchData(url, options)
         .then((fetchedData) => {
            setIsPosting(false);
            setIsWorkPosting(false);
            get();
         })
         .catch((err) => {
            setError("Failed to fetch data");
            setIsPosting(false);
         });
   };

   useEffect(() => {
      get(0);
   }, []);

   const homework = (data) => {
      let num = 0;
      for (let i = 0; i < data.length; i++) {
         for (let j = 0; j < data[i].length / 2; j++) {
            num++;
            works.push({ value: num.toString(), label: num.toString() });
         }
      }
      setWorkOpt(works);
   };

   const handleChangeTime = (e) => {
      time = e.target.value;
   };
   const handleChangeSub = (e) => {
      sub = e.target.value;
   };
   const handleChangeWorkTime = (e) => {
      timeWork = e.target.value;
      setTimeWorkState(timeWork);
   };

   const selectTime = times.map((time) => {
      return (
         <option value={time.value} key={time.label}>
            {time.label}
         </option>
      );
   });
   const selectSub = subsListOpt.map((sub) => {
      return (
         <option value={sub.value} key={sub.label}>
            {sub.label}
         </option>
      );
   });
   let selectWorkTime = dataWorkOpt.map((timeWork) => {
      return (
         <option value={timeWork.value} key={timeWork.label}>
            {timeWork.label}
         </option>
      );
   });

   return (
      <div>
         <div className="carddiv">
            <p className="cardtex">{props.card}</p>
            <div className="cardChanged" id="card">
               <div className="card cardCh">
                  <div className="changedSub">
                     <DatePicker
                        portalId="root-portal"
                        id="datepicker"
                        onChange={(selectedDate) => {
                           setDate(selectedDate || Today);
                        }}
                        dateFormat="yyyy/MM/dd"
                        selected={date}
                        minDate={Today}
                        className="datepicker"
                        popperClassName="calendar-popout"
                        popperPlacement="top-end"
                        popperModifiers={{
                           offset: { enabled: true, offset: "5px, 10px" },
                           preventOverflow: {
                              enabled: true,
                              escapeWithReference: false,
                              boundariesElement: "viewport",
                           },
                        }}
                     />
                     <select onChange={handleChangeTime}>{selectTime}</select>
                  </div>
                  <select className="subButton" onChange={handleChangeSub} required>
                     {selectSub}
                  </select>
                  <div className="changedButton">
                     <div style={{ cursor: "pointer" }} onClick={() => get(0)} disabled={isFetching}>
                        更新
                     </div>
                     <div style={{ cursor: "pointer" }} onClick={() => post(0)}>
                        変更
                     </div>
                  </div>
                  {isFetching && <p>データ更新中</p>}
                  {isPosting && <p>データ送信中</p>}
               </div>
               <div>
                  {error ? (
                     <p style={{ color: "red" }}>{error}</p>
                  ) : data[0] ? (
                     <div>
                        {data.map((date, index) => (
                           <List className="card scheCard">
                              <ListItem>
                                 <div key={index} className="changeCard">
                                    <p className="scheText">
                                       {new Date(date[0]).getMonth() + 1}/{new Date(date[0]).getDate()}
                                    </p>
                                    {date[1].map((val, ind) => (
                                       <div className="subProp">
                                          <p className="scheText">{subsList[val[1] - 1]}</p>
                                          <p className="scheText">{json.time[1][val[0]]}</p>
                                       </div>
                                    ))}
                                 </div>
                              </ListItem>
                           </List>
                        ))}
                     </div>
                  ) : (
                     <List className="card scheCard" style={{ zIndex: -99 }}>
                        <ListItem>
                           <p>データなし</p>
                        </ListItem>
                     </List>
                  )}
               </div>
            </div>
         </div>
         <div className="carddiv">
            <p className="cardtex">Homework</p>
            <div className="cardChanged" id="card">
               <div className="card cardCh">
                  <div className="changedSub">
                     <DatePicker
                        portalId="root-portal"
                        id="datepickerWork"
                        onChange={(selectedDate) => {
                           setDate(selectedDate || Today);
                        }}
                        dateFormat="yyyy/MM/dd"
                        selected={date}
                        minDate={Today}
                        className="datepicker"
                        popperClassName="calendar-popout"
                        popperPlacement="top-end"
                        popperModifiers={{
                           offset: { enabled: true, offset: "5px, 10px" },
                           preventOverflow: {
                              enabled: true,
                              escapeWithReference: false,
                              boundariesElement: "viewport",
                           },
                        }}
                     />
                     <select onChange={handleChangeWorkTime}>{selectWorkTime}</select>
                  </div>
                  {timeWorkState == 0 && (
                     <input
                        className="workInput"
                        type="text"
                        value={textWork}
                        onChange={(event) => setWorkText(event.target.value)}
                     ></input>
                  )}
                  <div className="changedButton">
                     <div style={{ cursor: "pointer" }} onClick={() => get(1)} disabled={isFetching}>
                        更新
                     </div>
                     {timeWorkState != 0 && (
                        <div style={{ cursor: "pointer" }} onClick={() => post(2)}>
                           削除
                        </div>
                     )}
                     {timeWorkState == 0 && (
                        <div style={{ cursor: "pointer" }} onClick={() => post(1)}>
                           登録
                        </div>
                     )}
                  </div>
                  {isFetching && <p>データ更新中</p>}
                  {isWorkPosting && <p>データ送信中</p>}
               </div>
               <div>
                  {error ? (
                     <p style={{ color: "red" }}>{error}</p>
                  ) : dataWork[0] ? (
                     <div>
                        {dataWork.map((date, index) => (
                           <List className="card scheCard">
                              <ListItem>
                                 <div key={index} className="changeCard">
                                    <p className="scheText">
                                       {new Date(date[0]).getMonth() + 1}/{new Date(date[0]).getDate()}
                                    </p>
                                    {date[1].map((val, ind) => (
                                       <div className="subProp">
                                          <p className="scheText">{val[0]}</p>
                                          <p className="scheText">{val[1]}</p>
                                       </div>
                                    ))}
                                 </div>
                              </ListItem>
                           </List>
                        ))}
                     </div>
                  ) : (
                     <List className="card scheCard" style={{ zIndex: -99 }}>
                        <ListItem>
                           <p>データなし</p>
                        </ListItem>
                     </List>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChangeMix;
