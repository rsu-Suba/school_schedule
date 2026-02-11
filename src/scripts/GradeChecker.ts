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
   let resultScore: number = 0;

   if (isMidTest) {
      allExamScore = (examScores[0] + examScores[1]) / 2;
   }
   if (isYearTest) {
      allExamScore = (examScores[0] + examScores[1] + examScores[2] + examScores[3]) / 4;
   }
   if (isHWScore) {
      resultScore = (allExamScore * examPer) / 100 + HWScore;
   } else {
      resultScore = allExamScore;
   }
   resultScore = Math.round(resultScore);
   return resultScore;
};

const autoFillCalc = (examScores: number[], HWScore: number, examPer: number, checkBooleans: checkBooleansType) => {
   const { isMidTest, isYearTest, isHWScore } = checkBooleans;
   const targetScore = 60;
   const hwPer = 100 - examPer;

   let relevantExamIndices: number[] = [];
   if (isYearTest) {
      relevantExamIndices = [0, 1, 2, 3];
   } else if (isMidTest) {
      relevantExamIndices = [0, 1];
   } else {
      relevantExamIndices = [1];
   }

   const zeroExamIndices = relevantExamIndices.filter((i) => examScores[i] === 0);
   const fixedExamSum = relevantExamIndices
      .filter((i) => examScores[i] !== 0)
      .reduce((sum, i) => sum + examScores[i], 0);

   const isHWZero = isHWScore && HWScore === 0;
   const fixedHWScore = isHWScore && !isHWZero ? HWScore : 0;

   const N = relevantExamIndices.length;
   const effectiveExamPer = isHWScore ? examPer : 100;

   const leftSide = targetScore - (fixedExamSum * effectiveExamPer) / (100 * N) - (isHWScore ? fixedHWScore : 0);
   const multiplier = (zeroExamIndices.length * 100 * effectiveExamPer) / (100 * N) + (isHWZero ? hwPer : 0);

   if (multiplier <= 0) return { examScores, HWScore };

   let x = leftSide / multiplier;
   if (x < 0) x = 0;
   if (x > 1) x = 1;

   const newExamScores = [...examScores];
   zeroExamIndices.forEach((i) => {
      newExamScores[i] = Math.ceil(100 * x);
   });

   let newHWScore = HWScore;
   if (isHWZero) {
      newHWScore = Math.ceil(hwPer * x);
   }

   return { examScores: newExamScores, HWScore: newHWScore };
};

export { seasonFC, scoreColorFC, scoreCalc, autoFillCalc };
