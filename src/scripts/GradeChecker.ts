import { subsListGradeOpt_Array } from "@/scripts/Data/DataPack";
import useContexts from "@/scripts/Data/Contexts";

const seasonFC = (season: string) => {
   const { Credit } = useContexts();
   const seasonArray: string[] = [Credit.Year, Credit.FirstH, Credit.SecondH];
   const seasonNum: number = parseInt(season);
   const subsSeason: number = subsListGradeOpt_Array[seasonNum - 1].season;
   return seasonArray[subsSeason];
};

const scoreColorFC = (score: number) => {
   let scoreColor: string = "green";
   let gradeStatus: string = "Get";
   if (score < 60) {
      scoreColor = "red";
      gradeStatus = "Drop";
   }
   return { scoreColor: scoreColor, gradeStatus: gradeStatus };
};

type checkBooleansType = {
   isMidTest: boolean;
   isYearTest: boolean;
   isHWScore: boolean;
};

const scoreCalc = (examScores: number[], HWScore: number, examPer: number, checkBooleans: checkBooleansType) => {
   const { isMidTest, isYearTest, isHWScore } = checkBooleans;
   let allExamScore: number = examScores[1];
   let allHWScore: number = 0;
   let resultScore: number = 0;

   let hwPer: number = 100 - examPer;
   if (isMidTest) {
      allExamScore = (examScores[0] + examScores[1]) / 2;
   }
   if (isYearTest) {
      allExamScore = (examScores[0] + examScores[1] + examScores[2] + examScores[3]) / 4;
   }
   if (isHWScore) {
      allHWScore = HWScore / hwPer;
      resultScore = (allExamScore * examPer) / 100 + allHWScore * hwPer;
   } else {
      resultScore = allExamScore;
   }
   resultScore = Math.round(resultScore);
   return resultScore;
};

export { seasonFC, scoreColorFC, scoreCalc };
