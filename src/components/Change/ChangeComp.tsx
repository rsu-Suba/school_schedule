import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Space, Button, Input, Select, DatePicker, List } from "antd";
import jsonData from "~/assets/main.json";
import { subsList_Array, times_Exam_Array } from "@/scripts/Data/DataPack";
import useContexts from "@/scripts/Data/Contexts";
import IsExamDate from "@/scripts/Change/isExamDate";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import type { State, jsonType } from "@/scripts/Data/type";

const jsonTime: jsonType = jsonData.time;

export const DateInput = (props: {
   dateId: string;
   date: Dayjs;
   setDate: State<Dayjs>;
   timeValue: string;
   handleChangeTime: (e: string) => void;
   timeOptions: { value: string; label: string }[];
}) => {
   const [TestStrNum, setTestStrNum] = useState(-1);
   const [selectOptions, setSelectOptions] = useState(props.timeOptions);

   useEffect(() => {
      if (props.dateId === "datepicker") {
         setSelectOptions(TestStrNum === -1 ? props.timeOptions : times_Exam_Array);
      } else if (props.dateId === "datepickerWork") {
         setSelectOptions(props.timeOptions);
      }
   }, [TestStrNum, props.timeOptions, props.dateId]);

   useEffect(() => {
      const datetext: string = `${props.date.year()}${String(props.date.month() + 1).padStart(2, "0")}${String(
         props.date.date()
      ).padStart(2, "0")}`;
      const IsExamDatePack = IsExamDate(datetext);
      setTestStrNum(IsExamDatePack.TestStrNum);
   }, [props.date]);

   const handleDateChange = (date: Dayjs | null) => {
      if (date) {
         props.setDate(date);
         const datetext: string = `${date.year()}${String(date.month() + 1).padStart(2, "0")}${String(
            date.date()
         ).padStart(2, "0")}`;
         const IsExamDatePack = IsExamDate(datetext);
         setTestStrNum(IsExamDatePack.TestStrNum);
      }
   };

   return (
      <Space direction="horizontal" className="changeSpace2">
         <DatePicker
            id={props.dateId}
            className="datePicker"
            value={props.date}
            minDate={dayjs()}
            maxDate={dayjs("2026-03-31")}
            onChange={handleDateChange}
            size="large"
         />
         <Select value={props.timeValue} onChange={props.handleChangeTime} options={selectOptions} size="large" />
      </Space>
   );
};

export const InputSelector = (props: {
   subjectOptions: { value: string; label: string }[] | null;
   subjectValue: string | null;
   handleChangeSubject: ((e: string) => void) | null;
   showInput?: boolean;
   textValue: string;
   setTextValue: State<string>;
}) => {
   return (
      <>
         {props.subjectOptions && (
            <Select
               className="subSelect"
               value={props.subjectValue!}
               onChange={props.handleChangeSubject!}
               options={props.subjectOptions!}
               size="large"
            />
         )}
         {props.showInput && (
            <Input
               id="outlined-basic"
               placeholder="Homework Title"
               value={props.textValue}
               onChange={(event) => props.setTextValue(event.target.value)}
               size="large"
            />
         )}
      </>
   );
};

export const ButtonComp = (props: {
   variant: "outlined" | "solid";
   click: () => void;
   load: boolean;
   disabled: boolean;
   children: React.ReactNode;
}) => {
   return (
      <Button
         color="primary"
         variant={props.variant}
         size="large"
         shape="round"
         style={{ cursor: "pointer" }}
         onClick={props.click}
         loading={props.load}
         disabled={props.disabled}
      >
         {props.children}
      </Button>
   );
};

export const ButtonPair = (props: {
   get: () => void;
   post: (mode: number) => void;
   isFetching: boolean;
   isPosting: boolean;
   postMode: number;
   showInput: boolean;
}) => {
   const { ButtonContexts } = useContexts();

   return (
      <div className="changedButton">
         <ButtonComp
            variant="outlined"
            click={props.get}
            disabled={props.isFetching || props.isPosting}
            load={props.isFetching}
         >
            {ButtonContexts.Update}
         </ButtonComp>
         {props.postMode !== null && (
            <ButtonComp
               variant="solid"
               click={() => props.post(props.postMode)}
               load={props.isPosting}
               disabled={false}
            >
               {props.postMode == 0
                  ? ButtonContexts.Change
                  : props.showInput == true
                  ? ButtonContexts.Submit
                  : ButtonContexts.Delete}
            </ButtonComp>
         )}
      </div>
   );
};

export const ChangeList = (props: { children: React.ReactNode }) => {
   return (
      <List className="card scheCard">
         <List.Item>
            <div className="changeCard">{props.children}</div>
         </List.Item>
      </List>
   );
};

export const ChangeListMapper = (props: { mode: string; ListDate: string; data: [number | string, number][] }) => {
   const subsList: string[] = subsList_Array;
   const { CardTitleContexts } = useContexts();
   const datetext: string = getCustomDate(props.ListDate, "YYYYMMDD");
   const IsExamDatePack = IsExamDate(datetext);

   if (props.mode === CardTitleContexts.ChangeInteg_SC) {
      return (
         <>
            {props.data.map((val: [number | string, number]) => (
               <div className="subProp">
                  <p className="scheText">{subsList[val[1] - 1]}</p>
                  <p className="time">{jsonTime[IsExamDatePack.TestStrNum == -1 ? 1 : 3][val[0]]}</p>
               </div>
            ))}
         </>
      );
   } else {
      return (
         <>
            {props.data.map((val: [number | string, number]) => (
               <div className="subProp">
                  <p className="scheText">{val[0]}</p>
                  <p className="scheText">{val[1]}</p>
               </div>
            ))}
         </>
      );
   }
};

export const NoData = () => {
   const { CardInsideContexts } = useContexts();
   return (
      <ChangeList>
         <p>{CardInsideContexts.NoData}</p>
      </ChangeList>
   );
};

export const ErrorData = (props: { error: string }) => {
   return (
      <ChangeList>
         <p style={{ color: "red" }}>{props.error}</p>
      </ChangeList>
   );
};
