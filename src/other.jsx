import React from "react";
import "./App.css";
import { List, Button, Divider, ConfigProvider } from "antd";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DarkTheme from "./darkComp.jsx";

function cardMake(title, prop, isLast) {
   if (isLast == 0) {
      return (
         <div className="carddiv">
            <div className="cardTitle">
               <p className="cardtex">
                  <span style={{ color: "var(--main-color)" }}>{title.slice(0, 1)}</span>
                  <span>{title.slice(1)}</span>
               </p>
            </div>
            <div className="card" id="card">
               <List>
                  <List.Item>
                     <div className="cardRight othercardtext">{prop}</div>
                  </List.Item>
               </List>
            </div>
         </div>
      );
   } else {
      return (
         <div className="carddiv cardLast">
            <div className="cardTitle">
               <p className="cardtex">
                  <span style={{ color: "var(--main-color)" }}>{title.slice(0, 1)}</span>
                  <span>{title.slice(1)}</span>
               </p>
            </div>
            <div className="card" id="card">
               <List>
                  <List.Item>
                     <div className="cardRight othercardtext">{prop}</div>
                  </List.Item>
               </List>
            </div>
         </div>
      );
   }
}

let howtotext = [];
const timesubs = [
   `-Timetable Tab-`,
   `
   <p class="othercardsub">上から順に次の授業, 当日の時間割, 翌日の時間割のブロック</p>
   <p>&nbsp;</p>
   <p class="othercardsub">ブロックの説明 : 教科名, 持ち物類(シラバスより), 授業時間</p>
   <p class="othercardarrow">シラバスが公開されている教科をタップするとWebシラバスへ移動する</p>
   <p>&nbsp;</p>
   <p class="othercardsub">次の授業ブロック</p>
   <p class="othercardarrow">授業終了時刻を過ぎると終了した授業は消える</p>
   <p class="othercardarrow">その日の授業がすべて終わると翌日の授業が並ぶ</p>`,
];
const schesubs = [
   `-Schedule Tab-`,
   `
<p class="othercardsub">上から順にピッカーカレンダー, 指定日の予定, 週ごとの予定表のブロック</p>
<p>&nbsp;</p>
<p class="othercardsub">カレンダーで日付の右上にドットがある日は予定がある日</p>
<p>&nbsp;</p>
<p class="othercardsub">指定日の予定ブロック : カレンダーで日時をタップするとその日の予定を表示する</p>
<p>&nbsp;</p>
<p class="othercardsub">週ごとの予定表ブロック</p>
<p class="othercardarrow">表示月の予定をすべてリストアップ</p>
<p class="othercardarrow">日~土までの週ごとに予定リストを分割</p>`,
];
const subs = [schesubs, timesubs];
let nowMode = 1;

export default function App(props) {
   let cards = [];

   const howtoButton = () => {
      nowMode = nowMode * -1 + 1;
      document.getElementById("chapter").innerHTML = subs[nowMode][0];
      document.getElementById("howtosubs").innerHTML = subs[nowMode][1];
   };

   const darkcall = (data) => {
      props.handleValueChange(data);
   };

   cards.push(
      cardMake(
         "Settings",
         [
            <div className="subProp">
               <p>Dark Theme</p>
               <DarkTheme handleValueChange={darkcall} dark={props.dark} />
            </div>,
         ],
         0
      )
   );
   cards.push(
      cardMake(
         "How to Use?",
         [
            <div>
               <div className="howtouseTop">
                  <p className="chapter" id="chapter">
                     -Timetable Tab-
                  </p>
                  <div className="howtouseTopButtons">
                     <Button
                        aria-label="back"
                        size="small"
                        onClick={() => {
                           howtoButton();
                        }}
                     >
                        <ArrowBackIosNewOutlinedIcon fontSize="small" />
                     </Button>
                     <Button
                        aria-label="forward"
                        size="small"
                        onClick={() => {
                           howtoButton();
                        }}
                     >
                        <ArrowForwardIosOutlinedIcon fontSize="small" />
                     </Button>
                  </div>
               </div>
               <Divider />
               <div id="howtosubs">
                  <p className="othercardsub">上から順に次の授業, 当日の時間割, 翌日の時間割のブロック</p>
                  <p>&nbsp;</p>
                  <p className="othercardsub">ブロックの説明 : 教科名, 持ち物類(シラバスより), 授業時間</p>
                  <p className="othercardarrow">シラバスが公開されている教科をタップするとWebシラバスへ移動する</p>
                  <p>&nbsp;</p>
                  <p className="othercardsub">次の授業ブロック</p>
                  <p className="othercardarrow">授業終了時刻を過ぎると終了した授業は消える。</p>
                  <p className="othercardarrow">その日の授業がすべて終わると翌日の授業が並ぶ。</p>
               </div>
            </div>,
         ],
         0
      )
   );
   cards.push(cardMake("Planned Features", [<p className="othercardsub">None</p>], 0));
   cards.push(
      cardMake("Info", [
         <p className="othercardsub">要望, バグレポート</p>,
         <p className="othercardarrow">
            <a href="https://forms.gle/zLRBXtGmQxGRWxcP9" target="_blank">
               Google Forms
            </a>
         </p>,
         <p>&nbsp;</p>,
         <p className="othercardsub">
            <a href="https://github.com/rsu-Suba/school_schedule" target="_blank">
               Repository
            </a>
         </p>,
         <p className="subName">
            <a href="https://ja.react.dev/" target="_blank">
               React
            </a>
            ,&nbsp;
            <a href="https://ant.design/" target="_blank">
               Ant Design
            </a>
            , JavaScript, Google Apps Script, ChatGPT
         </p>,
         <p className="subName">
            Made by{" "}
            <a href="https://github.com/rsu-Suba" target="_blank">
               rsu-Suba
            </a>
         </p>,
         <h4 className="lastText" style={{ textAlign: "right" }}>
            Faster than light. v2.17.25
         </h4>,
      ])
   );
   return <>{cards}</>;
}
