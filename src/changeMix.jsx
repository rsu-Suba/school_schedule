import React, { useState, useEffect } from "react";
import { fetchData } from "./changeGet";
import json from "./assets/main.json";
import { List, Select, Input, DatePicker, Space, Button, ConfigProvider, Skeleton } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ja";

const ChangeMix = (props) => {
   const [data, setData] = useState([]);
   const [dataWork, setWorkData] = useState([]);
   const [dataWorkOpt, setWorkOpt] = useState([{ value: "0", label: "0" }]);
   const [isFetching, setIsFetching] = useState(false);
   const [isPosting, setIsPosting] = useState(false);
   const [isWorkPosting, setIsWorkPosting] = useState(false);
   const [textWork, setWorkText] = useState("");
   const [error, setError] = useState(null);
   const [timeWorkState, setTimeWorkState] = useState(0);
   const [date, setDate] = React.useState(null);
   const [dateWork, setDateWork] = React.useState(null);
   const [time, setTime] = useState(1);
   const [sub, setSub] = useState(0);
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
      fetchData(options)
         .then((fetchedData) => {
            setData(fetchedData[0]);
            setWorkData(fetchedData[1]);
            homework(fetchedData[1]);
            setIsFetching(false);
         })
         .catch((err) => {
            setError("Failed to fetch data");
            console.log(err);
            setIsFetching(false);
         });
   };

   const post = (mode) => {
      let options = {};
      if (mode == 0) {
         setIsPosting(true);
         options = {
            method: "POST",
            body: JSON.stringify({
               date: document.getElementById("datepicker").value,
               time: time,
               value: sub + 1,
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
      fetchData(options)
         .then((fetchedData) => {
            setIsPosting(false);
            setIsWorkPosting(false);
            if (mode == 1) {
               setWorkText("");
            }
            get();
         })
         .catch((err) => {
            setError("Failed to fetch data");
            setIsPosting(false);
         });
   };

   useEffect(() => {
      get();
      setDate(dayjs());
      setDateWork(dayjs());
   }, []);

   const homework = (data) => {
      works = [{ value: "0", label: "0" }];
      let num = 0;
      for (let i = 0; i < data.length; i++) {
         for (let j = 0; j < data[i][1].length; j++) {
            num++;
            works.push({ value: num.toString(), label: num.toString() });
         }
      }
      setWorkOpt(works);
   };

   const handleChangeTime = (e) => {
      setTime(e);
   };
   const handleChangeSub = (e) => {
      setSub(e - 1);
   };
   const handleChangeWorkTime = (e) => {
      setTimeWorkState(e);
   };

   return (
      <div className="changeMix">
            <div className="carddiv">
               <div className="cardTitle">
                  <p className="cardtex">
                     <span style={{ color: "var(--main-color)" }}>{props.card.slice(0, 1)}</span>
                     <span>{props.card.slice(1)}</span>
                  </p>
               </div>
               <div className="cardChanged" id="card">
                  <div className="card cardCh">
                     <Space direction="vertical" className="changeSpace1">
                        <Space direction="horizontal" className="changeSpace2">
                           <DatePicker
                              id="datepicker"
                              className="datePicker"
                              views={["year", "month", "day"]}
                              value={date}
                              minDate={dayjs()}
                              maxDate={dayjs("2025-03-31")}
                              onChange={(selectedDate) => {
                                 setDate(selectedDate);
                              }}
                              size="large"
                           />
                           <Select
                              labelId="Label-Time"
                              value={time}
                              label="Time"
                              onChange={handleChangeTime}
                              options={times}
                              size="large"
                           />
                        </Space>
                        <Select
                           className="subSelect"
                           labelId="Label-Sub"
                           value={subsList[sub]}
                           label="Subject"
                           onChange={handleChangeSub}
                           options={subsListOpt}
                           size="large"
                        />
                        <div className="changedButton">
                           <Button
                              color="primary"
                              variant="outlined"
                              size="large"
                              shape="round"
                              style={{ cursor: "pointer" }}
                              onClick={() => get(0)}
                              disabled={isFetching || isPosting}
                              loading={isFetching}
                           >
                              更新
                           </Button>
                           <Button
                              color="primary"
                              variant="solid"
                              size="large"
                              shape="round"
                              style={{ cursor: "pointer" }}
                              onClick={() => post(0)}
                              loading={isPosting}
                           >
                              変更
                           </Button>
                        </div>
                     </Space>
                  </div>
                  <div>
                     {isFetching ? (
                        <List className="card scheCard">
                           <List.Item>
                              <Skeleton active round paragraph={{ rows: 2 }} title={false} />
                           </List.Item>
                        </List>
                     ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                     ) : data[0] ? (
                        <div>
                           {data.map((date, index) => (
                              <List className="card scheCard">
                                 <List.Item>
                                    <div className="changeCard">
                                       <p className="scheText">
                                          {new Date(date[0]).getMonth() + 1}/{new Date(date[0]).getDate()}
                                       </p>
                                       {date[1].map((val, ind) => (
                                          <div className="subProp">
                                             <p className="scheText">{subsList[val[1] - 1]}</p>
                                             <p className="time">{json.time[1][val[0]]}</p>
                                          </div>
                                       ))}
                                    </div>
                                 </List.Item>
                              </List>
                           ))}
                        </div>
                     ) : (
                        <List className="card scheCard">
                           <List.Item>
                              <p>データなし</p>
                           </List.Item>
                        </List>
                     )}
                  </div>
               </div>
            </div>
            <div className="carddiv">
               <div className="cardTitle">
                  <p className="cardtex">
                     <span style={{ color: "var(--main-color)" }}>H</span>
                     <span>omework</span>
                  </p>
               </div>
               <div className="cardChanged" id="card">
                  <div className="card cardCh">
                     <Space direction="vertical" className="changeSpace1">
                        <Space direction="horizontal" className="changeSpace2">
                           <DatePicker
                              id="datepickerWork"
                              className="datePicker"
                              views={["year", "month", "day"]}
                              label="Date"
                              value={dateWork}
                              minDate={dayjs()}
                              maxDate={dayjs("2025-03-31")}
                              defaultValue={dayjs()}
                              onChange={(selectedDate) => {
                                 setDateWork(selectedDate);
                              }}
                              size="large"
                           />
                           <Select
                              labelId="Label-WorkTime"
                              value={timeWorkState}
                              label="Time"
                              onChange={handleChangeWorkTime}
                              options={dataWorkOpt}
                              size="large"
                           />
                        </Space>
                        {timeWorkState == 0 && (
                           <Input
                              id="outlined-basic"
                              placeholder="Homework Title"
                              value={textWork}
                              onChange={(event) => setWorkText(event.target.value)}
                              size="large"
                           />
                        )}
                     </Space>
                     <div className="changedButton">
                        <Button
                           color="primary"
                           variant="outlined"
                           size="large"
                           shape="round"
                           style={{ cursor: "pointer" }}
                           onClick={() => get(1)}
                           disabled={isFetching || isWorkPosting}
                           loading={isFetching}
                        >
                           更新
                        </Button>
                        {timeWorkState != 0 && (
                           <Button
                              color="primary"
                              variant="solid"
                              size="large"
                              shape="round"
                              style={{ cursor: "pointer" }}
                              onClick={() => post(2)}
                              loading={isWorkPosting}
                           >
                              削除
                           </Button>
                        )}
                        {timeWorkState == 0 && (
                           <Button
                              color="primary"
                              variant="solid"
                              size="large"
                              shape="round"
                              style={{ cursor: "pointer" }}
                              onClick={() => post(1)}
                              loading={isWorkPosting}
                           >
                              登録
                           </Button>
                        )}
                     </div>
                  </div>
                  <div>
                     {isFetching ? (
                        <List className="card scheCard">
                           <List.Item>
                              <Skeleton active round paragraph={{ rows: 2 }} title={false} />
                           </List.Item>
                        </List>
                     ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                     ) : dataWork[0] ? (
                        <div>
                           {dataWork.map((date, index) => (
                              <List className="card scheCard">
                                 <List.Item>
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
                                 </List.Item>
                              </List>
                           ))}
                        </div>
                     ) : (
                        <List className="card scheCard">
                           <List.Item>
                              <p>データなし</p>
                           </List.Item>
                        </List>
                     )}
                  </div>
               </div>
            </div>
      </div>
   );
};

export default ChangeMix;
