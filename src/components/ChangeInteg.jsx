import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { getChange, homework, postChange } from "@/scripts/api";
import ChangeCard from "./ChangeCard";
import useContexts from "@/scripts/Contexts";

export default function ChangeInteg() {
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
   const { CardTitleContexts } = useContexts();
   const get = () => {
      getChange(setData, setWorkData, (d) => homework(d, setWorkOpt), setIsFetching, setError);
   };

   const post = (mode) => {
      postChange(
         mode,
         setIsPosting,
         setIsWorkPosting,
         setError,
         () => get(),
         time,
         sub,
         textWork,
         timeWorkState,
         setTimeWorkState,
         setWorkText
      );
   };

   const changeCardProps = {
      isFetching: isFetching,
      post: post,
      get: get,
      error: error,
   };

   useEffect(() => {
      get();
      setDate(dayjs());
      setDateWork(dayjs());
   }, []);

   return (
      <div className="changeMix">
         <ChangeCard
            card={CardTitleContexts.ChangeInteg_SC}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            isPosting={isPosting}
            postMode={0}
            data={data}
            sub={sub}
            setSub={setSub}
            {...changeCardProps}
         />
         <ChangeCard
            card={CardTitleContexts.ChangeInteg_HW}
            date={dateWork}
            setDate={setDateWork}
            time={timeWorkState}
            setTime={setTimeWorkState}
            isPosting={isWorkPosting}
            postMode={timeWorkState === 0 ? 1 : 2}
            data={dataWork}
            timeOptions={dataWorkOpt}
            showInput={timeWorkState == 0}
            textValue={textWork}
            setTextValue={setWorkText}
            {...changeCardProps}
         />
      </div>
   );
}
