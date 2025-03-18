import React from "react";
import "dayjs/locale/ja";
import { times_Array, subsListOpt_Array, subsList_Array } from "@/scripts/DataPack";
import { CardBase, CardInside, LoadSkeleton } from "@/components/CardComp";
import { ChangeList, ChangeListMapper, NoData, ErrorData } from "@/components/ChangeComp";
import ChangeController from "@/components/ChangeController";
import getCustomDate from "@/scripts/getCustomDate";
import useContexts from "@/scripts/Contexts";

export default function ChangeCard({
   card,
   date,
   setDate,
   time,
   setTime,
   isPosting,
   postMode,
   data,
   isFetching,
   post,
   get,
   sub,
   setSub,
   timeOptions,
   showInput,
   textValue,
   setTextValue,
   error,
}) {
   const times = times_Array;
   const subsListOpt = subsListOpt_Array;
   const subsList = subsList_Array;
   const { CardTitleContexts, CardInsideContexts } = useContexts();
   const changeControllerProps = {
      dateId: card === CardTitleContexts.ChangeInteg_SC ? "datepicker" : "datepickerWork",
      date: date,
      setDate: setDate,
      timeValue: time,
      handleChangeTime: (e) => setTime(e),
      isFetching: isFetching,
      isPosting: isPosting,
      postMode: postMode,
      post: post,
      get: get,
      timeOptions: card === CardTitleContexts.ChangeInteg_SC ? times : timeOptions,
      showInput: showInput,
      textValue: textValue,
      setTextValue: setTextValue,
      subjectValue: subsList[sub],
      subjectOptions: card === CardTitleContexts.ChangeInteg_SC ? subsListOpt : null,
      handleChangeSubject: (e) => setSub(e - 1),
   };

   return (
      <CardBase title={card}>
         <div className="cardChanged" id="card">
            <ChangeController {...changeControllerProps} />
            <div>
               {isFetching ? (
                  <CardInside>
                     <LoadSkeleton />
                  </CardInside>
               ) : error ? (
                  <ErrorData error={CardInsideContexts.FailedFetch} />
               ) : data[0] ? (
                  <div>
                     {data.map((date) => (
                        <ChangeList>
                           <p className="scheText">{getCustomDate(date[0], "MM/DD")}</p>
                           <ChangeListMapper mode={card} data={date[1]} />
                        </ChangeList>
                     ))}
                  </div>
               ) : (
                  <NoData />
               )}
            </div>
         </div>
      </CardBase>
   );
}
