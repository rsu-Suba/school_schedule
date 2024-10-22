import React, { useState, useEffect } from "react";
import { fetchData } from "./changeGet";
import json from "./assets/main.json";
import DatePicker from "react-datepicker";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

let time = 1;
let sub = 1;

const ChangeMix = (props) => {
   // 初期状態として1つのデータを設定
   const [data, setData] = useState([]);

   const [isFetching, setIsFetching] = useState(false);
   const [isPosting, setIsPosting] = useState(false);
   const [error, setError] = useState(null); // エラーメッセージ用のState

   const Today = new Date();
   const [date, setDate] = React.useState(Today);

   const times = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
   ];
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
            setData(fetchedData);
            setIsFetching(false);
         })
         .catch((err) => {
            setError("Failed to fetch data");
            setIsFetching(false);
         });
   };

   const post = () => {
      setIsPosting(true);
      const url =
         "https://script.google.com/macros/s/AKfycbxrHb3CB2P2fhTsF6YtCggz8pKiu9bJ1NFPF7i6yZ8YGgpt9Djx00G7c3_5pfA-uvqO/exec";
      const options = {
         method: "POST",
         body: JSON.stringify({
            sheet: "sheet1",
            date: document.getElementById("datepicker").value,
            time: time,
            value: sub,
         }),
      };
      fetchData(url, options)
         .then((fetchedData) => {
            setIsPosting(false);
            get();
         })
         .catch((err) => {
            setError("Failed to fetch data");
            setIsPosting(false);
         });
   };

   useEffect(() => {
      get();
   }, []);

   const handleChangeTime = (e) => {
      time = e.target.value;
   };
   const handleChangeSub = (e) => {
      sub = e.target.value;
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

   return (
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
                  <div onClick={get} disabled={isFetching}>
                     更新
                  </div>
                  <div onClick={post}>変更</div>
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
                  <List className="card scheCard">
                     <ListItem>
                        <p>データなし</p>
                     </ListItem>
                  </List>
               )}
            </div>
         </div>
      </div>
   );
};

export default ChangeMix;
