import { Space } from "antd";
import "@/App.css";
import { useState } from "react";
import { CardBase, CardInside } from "@/components/Layout/CardComp";
import { subsListGradeOpt_Array } from "@/scripts/Data/DataPack";
import useContexts from "@/scripts/Data/Contexts";
import { scoreColorFC, scoreCalc } from "@/scripts/GradeChecker";
import { GCHeader, ExamInput, HWInput } from "@/components/Grade/GradeCheckerComp";

export default function GradeChecker() {
   const { CardTitleContexts, Credit } = useContexts();

   const [value, setValue] = useState<string>("1");
   const [resultScore, setResultScore] = useState<number>(0);
   const [examScore1, setExamScore1] = useState<number>(0);
   const [examScore2, setExamScore2] = useState<number>(0);
   const [examScore3, setExamScore3] = useState<number>(0);
   const [examScore4, setExamScore4] = useState<number>(0);
   const [HWScore, setHWScore] = useState<number>(0);

   let scoreColor: string = scoreColorFC(resultScore).scoreColor;
   let gradeStatus: string = scoreColorFC(resultScore).gradeStatus;

   const examPer: number = subsListGradeOpt_Array[parseInt(value) - 1].examPer;
   const HWPer: number = 100 - examPer;

   let isMidTest: boolean = subsListGradeOpt_Array[parseInt(value) - 1].midTest;
   let isYearTest: boolean = subsListGradeOpt_Array[parseInt(value) - 1].season === 0 ? true : false;
   let isHWScore: boolean = subsListGradeOpt_Array[parseInt(value) - 1].HW;
   let checkBooleans = {
      isMidTest,
      isYearTest,
      isHWScore,
   };

   const handleChange = (e: string) => {
      setValue(e);
      setExamScore1(0);
      setExamScore2(0);
      setExamScore3(0);
      setExamScore4(0);
      setHWScore(0);
   };

   let examScores: number[] = [examScore1, examScore2, examScore3, examScore4];

   const setExamScoreProp = (mode: number, e: number) => {
      if (mode === 1) {
         setExamScore1(e);
      } else if (mode === 2) {
         setExamScore2(e);
      } else if (mode === 3) {
         setExamScore3(e);
      } else if (mode === 4) {
         setExamScore4(e);
      }
      examScores[mode - 1] = e;
      setResultScore(scoreCalc(examScores, HWScore, examPer, checkBooleans));
   };

   const HWScoreProp = (e: number) => {
      setHWScore(e);
      setResultScore(scoreCalc(examScores, e, examPer, checkBooleans));
   };

   return (
      <CardBase title={CardTitleContexts.Credit}>
         <CardInside className="cardCh">
            <Space direction="vertical" className="changeSpace1">
               <GCHeader value={value} handleChange={handleChange} examPer={examPer} />
               {isMidTest && (
                  <ExamInput text={Credit.MidTest} examScoreProp={setExamScoreProp} mode={1} examScore={examScore1} />
               )}
               <ExamInput text={Credit.FinalTest} examScoreProp={setExamScoreProp} mode={2} examScore={examScore2} />

               {isYearTest && (
                  <>
                     <ExamInput
                        text={Credit.MidTest}
                        examScoreProp={setExamScoreProp}
                        mode={3}
                        examScore={examScore3}
                     />
                     <ExamInput
                        text={Credit.FinalTest}
                        examScoreProp={setExamScoreProp}
                        mode={4}
                        examScore={examScore4}
                     />
                  </>
               )}
               {isHWScore && <HWInput HWScoreProp={HWScoreProp} HWScore={HWScore} HWPer={HWPer} />}
               <p className="GCResult">
                  <span style={{ color: scoreColor }}>{resultScore}</span>
                  {Credit.Score}: {Credit.Credit}
                  {gradeStatus}
               </p>
            </Space>
         </CardInside>
      </CardBase>
   );
}
