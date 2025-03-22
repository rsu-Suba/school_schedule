import { Select, InputNumber } from "antd";
import type { InputNumberProps } from "antd";
import { subsListGradeOpt_Array } from "@/scripts/Data/DataPack";
import useContexts from "@/scripts/Data/Contexts";
import { seasonFC } from "@/scripts/GradeChecker";

function GCHeader(props: { value: string; handleChange: (e: string) => void; examPer: number }) {
   const { Credit } = useContexts();
   let season: string = seasonFC(props.value);

   return (
      <div className="GCHeader">
         <Select
            className="subSelect"
            value={props.value}
            onChange={props.handleChange}
            options={subsListGradeOpt_Array}
            size="large"
         />
         <p>
            {season}
            {Credit.Subject} | {Credit.Test}
            {props.examPer}%
         </p>
      </div>
   );
}

function ExamInput(props: {
   text: string;
   examScoreProp: (mode: number, e: number) => void;
   mode: number;
   examScore: number;
}) {
   const setExam = (e: number | null) => {
      if (e !== null) {
         props.examScoreProp(props.mode, e);
         examScore = e;
      }
   };

   let examScore: number = props.examScore;
   return (
      <div className="subProp">
         <p>{props.text} (0~100)</p>
         <InputNumber min={0} max={100} value={examScore} onChange={(e) => setExam(e)} />
      </div>
   );
}

function HWInput(props: { HWScoreProp: (e: number) => void; HWScore: number; HWPer: number }) {
   const { Credit } = useContexts();
   let HWScore: number = props.HWScore;

   const setHW: InputNumberProps["onChange"] = (newValue) => {
      props.HWScoreProp(newValue as number);
      HWScore = newValue as number;
   };

   return (
      <div className="subProp">
         <p>{Credit.HW} (0~{props.HWPer})</p>
         <InputNumber min={0} max={props.HWPer} style={{ margin: "0 0 0 12px" }} value={HWScore} onChange={setHW} />
      </div>
   );
}

export { GCHeader, ExamInput, HWInput };
