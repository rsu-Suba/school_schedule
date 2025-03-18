import React from "react";
import dayjs from "dayjs";
import { Space, Button, Input, Select, DatePicker, List } from "antd";
import json from "@/assets/main.json";
import { subsList_Array } from "@/scripts/DataPack";
import useContexts from "@/scripts/Contexts";

export const DateInput = (props) => {
   return (
      <Space direction="horizontal" className="changeSpace2">
         <DatePicker
            id={props.dateId}
            className="datePicker"
            views={["year", "month", "day"]}
            value={props.date}
            minDate={dayjs()}
            maxDate={dayjs("2025-03-31")}
            onChange={props.setDate}
            size="large"
         />
         <Select
            value={props.timeValue}
            label="Time"
            onChange={props.handleChangeTime}
            options={props.timeOptions}
            size="large"
         />
      </Space>
   );
};

export const InputSelector = (props) => {
   return (
      <>
         {props.subjectOptions && (
            <Select
               className="subSelect"
               value={props.subjectValue}
               label="Subject"
               onChange={props.handleChangeSubject}
               options={props.subjectOptions}
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

export const ButtonComp = (props) => {
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

export const ButtonPair = (props) => {
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
                  ? ButtonContexts.Change
                  : ButtonContexts.Delete}
            </ButtonComp>
         )}
      </div>
   );
};

export const ChangeList = (props) => {
   return (
      <List className="card scheCard">
         <List.Item>
            <div className="changeCard">{props.children}</div>
         </List.Item>
      </List>
   );
};

export const ChangeListMapper = (props) => {
   const subsList = subsList_Array;
   const { CardTitleContexts, CardInsideContexts, ButtonContexts, InfoContexts } = useContexts();

   if (props.mode === CardTitleContexts.ChangeInteg_SC) {
      return (
         <>
            {props.data.map((val) => (
               <div className="subProp">
                  <p className="scheText">{subsList[val[1] - 1]}</p>
                  <p className="time">{json.time[1][val[0]]}</p>
               </div>
            ))}
         </>
      );
   } else {
      return (
         <>
            {props.data.map((val) => (
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
   const { CardTitleContexts, CardInsideContexts, ButtonContexts, InfoContexts } = useContexts();
   return (
      <ChangeList>
         <p>{CardInsideContexts.NoData}</p>
      </ChangeList>
   );
};

export const ErrorData = (props) => {
   return (
      <ChangeList>
         <p style={{ color: "red" }}>{props.error}</p>
      </ChangeList>
   );
};
