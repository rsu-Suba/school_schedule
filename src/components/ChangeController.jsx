import React from "react";
import { Space } from "antd";
import { DateInput, InputSelector, ButtonPair } from "@/components/ChangeComp";
import { CardInside } from "@/components/CardComp";

export default function ChangeController({
   dateId,
   date,
   setDate,
   timeValue,
   handleChangeTime,
   timeOptions,
   showInput,
   textValue,
   setTextValue,
   subjectValue,
   subjectOptions,
   handleChangeSubject,
   isFetching,
   isPosting,
   postMode,
   post,
   get,
}) {
   return (
      <CardInside className="cardCh">
         <Space direction="vertical" className="changeSpace1">
            <DateInput
               dateId={dateId}
               date={date}
               setDate={setDate}
               timeValue={timeValue}
               handleChangeTime={handleChangeTime}
               timeOptions={timeOptions}
            />
            <InputSelector
               subjectOptions={subjectOptions}
               subjectValue={subjectValue}
               handleChangeSubject={handleChangeSubject}
               showInput={showInput}
               textValue={textValue}
               setTextValue={setTextValue}
            />
            <ButtonPair
               isFetching={isFetching}
               isPosting={isPosting}
               postMode={postMode}
               post={post}
               get={get}
               showInput={showInput}
            />
         </Space>
      </CardInside>
   );
}
