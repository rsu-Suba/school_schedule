export const times_Array: { value: string; label: string }[] = [
   { value: "1", label: "1" },
   { value: "2", label: "2" },
   { value: "3", label: "3" },
   { value: "4", label: "4" },
];
export const times_Exam_Array: { value: string; label: string }[] = [
   { value: "1", label: "50分9:20~" },
   { value: "2", label: "50分10:20~" },
   { value: "3", label: "50分11:20~" },
   { value: "4", label: "50分11:00~" },
   { value: "5", label: "90分9:20~" },
   { value: "6", label: "90分10:20~" },
   { value: "7", label: "90分11:00~" },
];
export const subsListOpt_Array: { value: string; label: string }[] = [
   { value: "1", label: "電気回路I" },
   { value: "2", label: "物理学II" },
   { value: "3", label: "英語表現III" },
   { value: "4", label: "総合国語IIIA" },
   { value: "5", label: "体育III" },
   { value: "6", label: "電子回路I" },
   { value: "7", label: "電子情報工学実験IIIA" },
   { value: "8", label: "コンピューターシステムIII" },
   { value: "9", label: "総合英語III" },
   { value: "10", label: "電子情報数学II" },
   { value: "11", label: "アルゴリズムとデータ構造I" },
   { value: "12", label: "解析学I" },
   { value: "13", label: "確率と統計" },
   { value: "14", label: "歴史II" },
   { value: "15", label: "応用物理I" },
   { value: "16", label: "休み" },
   { value: "17", label: "その他" },
   { value: "18", label: "削除" },
];
export const subsList_Array: string[] = [
   "電気回路I",
   "物理学II",
   "英語表現III",
   "総合国語IIIA",
   "体育III",
   "電子回路I",
   "電子情報工学実験IIIA",
   "コンピューターシステムIII",
   "総合英語III",
   "電子情報数学II",
   "アルゴリズムとデータ構造I",
   "解析学I",
   "確率と統計",
   "歴史II",
   "応用物理I",
   "歴史I",
   "休み",
   "その他",
   "削除",
];

export const languages: { value: string; label: string }[] = [
   { value: "ja", label: "日本語" },
   { value: "en", label: "English" },
];
export const accentsColors: string[][] = [
   ["#007AFF", "#AF52DE", "#FF3B30", "#FFCC00", "#34C759", "#8E8E93"],
   ["#0a84ff", "#bf5af2", "#ff453a", "#ffd60a", "#30d158", "#8e8e93"],
];

export const weekday: { en: string[]; ja: string[] } = {
   en: ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"],
   ja: ["日", "月", "火", "水", "木", "金", "土"],
};
export const subsListGradeOpt_Array: {
   value: string;
   label: string;
   season: number;
   midTest: boolean;
   HW: boolean;
   examPer: number;
}[] = [
   { value: "1", label: "電気回路I", season: 1, midTest: true, HW: false, examPer: 100 },
   { value: "2", label: "物理学II", season: 1, midTest: true, HW: true, examPer: 80 },
   { value: "3", label: "英語表現III", season: 0, midTest: true, HW: true, examPer: 50 },
   //{ value: "4", label: "総合国語IIIA", season: 2, midTest: true, HW: true, examPer: 70 },
   //{ value: "5", label: "電子回路I", season: 0, midTest: true, HW: false, examPer: 80 },
   { value: "6", label: "コンピューターシステムIII", season: 1, midTest: false, HW: true, examPer: 70 },
   { value: "7", label: "総合英語III", season: 0, midTest: true, HW: true, examPer: 70 },
   { value: "8", label: "電子情報数学II", season: 1, midTest: true, HW: true, examPer: 80 },
   { value: "9", label: "アルゴリズムとデータ構造I", season: 1, midTest: true, HW: true, examPer: 80 },
   //{ value: "10", label: "解析学I", season: 2, midTest: true, HW: true, examPer: 80 },
   //{ value: "11", label: "確率と統計", season: 2, midTest: true, HW: true, examPer: 80 },
   //{ value: "12", label: "歴史II", season: 0, midTest: true, HW: false, examPer: 100 },
   { value: "13", label: "応用物理I", season: 1, midTest: true, HW: true, examPer: 80 },
];
