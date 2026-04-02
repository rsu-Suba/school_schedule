export const times_Array: { value: string; label: string }[] = [
	{ value: "1", label: "1" },
	{ value: "2", label: "2" },
	{ value: "3", label: "3" },
	{ value: "4", label: "4" },
];
export const times_Exam_Array: { value: string; label: string }[] = [
	{ value: "1", label: "9:20~(50)" },
	{ value: "2", label: "9:20~(90)" },
	{ value: "3", label: "11:00~(50)" },
	{ value: "4", label: "11:00~(90)" },
	{ value: "5", label: "13:15~(50)" },
	{ value: "6", label: "13:15~(90)" },
	{ value: "7", label: "14:55~(50)" },
	{ value: "8", label: "14:55~(90)" },
];
export const subsListOpt_Array: { value: string; label: string }[] = [
	{ value: "1", label: "通信システム" },
	{ value: "2", label: "オペレーティングシステム" },
	{ value: "3", label: "電子情報工学実験IV" },
	{ value: "4", label: "電気回路II" },
	{ value: "5", label: "中国語 / ロシア語" },
	{ value: "6", label: "電気磁気学I" },
	{ value: "7", label: "電子回路III" },
	{ value: "8", label: "AI/MOT I" },
	{ value: "9", label: "応用数学I" },
	{ value: "10", label: "創造工学設計I" },
	{ value: "11", label: "情報理論" },
	{ value: "12", label: "英語演習I" },
	{ value: "13", label: "公共社会論" },
	{ value: "14", label: "総合英語IV" },
	{ value: "15", label: "応用物理III" },
	{ value: "16", label: "数学特講I" },
	{ value: "17", label: "休み" },
	{ value: "18", label: "その他" },
	{ value: "19", label: "削除" },
];
export const subsList_Array: string[] = [
"通信システム",
"オペレーティングシステム",
"電子情報工学実験IV",
"電気回路III",
"中国語 / ロシア語",
"電気磁気学I",
"電子回路III",
"AI/MOT I",
"応用数学I",
"創造工学設計I",
"情報理論",
"英語演習I",
"公共社会論",
"総合英語IV",
"応用物理III",
"数学特講I",
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
	{ value: "1", label: "通信システム", season: 1, midTest: true, HW: true, examPer: 70 },
	{ value: "2", label: "オペレーティングシステム", season: 1, midTest: false, HW: true, examPer: 70 },
	// { value: "3", label: "電子情報工学実験IV", season: 0, midTest: true, HW: true, examPer: 100 },
	{ value: "3", label: "電気回路III", season: 1, midTest: false, HW: false, examPer: 100 },
	{ value: "4", label: "中国語", season: 1, midTest: true, HW: true, examPer: 90 },
	{ value: "5", label: "ロシア語", season: 1, midTest: true, HW: true, examPer: 75 },
	{ value: "6", label: "電気磁気学I", season: 1, midTest: true, HW: true, examPer: 60 },
	{ value: "7", label: "電子回路III", season: 1, midTest: true, HW: true, examPer: 70 },
	{ value: "8", label: "AI/MOT I", season: 1, midTest: true, HW: true, examPer: 60 },
	{ value: "9", label: "応用数学I", season: 1, midTest: true, HW: true, examPer: 80 },
	{ value: "10", label: "創造工学設計I", season: 1, midTest: true, HW: true, examPer: 20 },
	{ value: "11", label: "情報理論", season: 1, midTest: true, HW: true, examPer: 80 },
	{ value: "12", label: "英語演習I", season: 1, midTest: true, HW: true, examPer: 80 },
	{ value: "13", label: "公共社会論", season: 1, midTest: true, HW: false, examPer: 100 },
	{ value: "14", label: "総合英語IV", season: 1, midTest: true, HW: true, examPer: 80 },
	{ value: "15", label: "応用物理III", season: 1, midTest: true, HW: true, examPer: 70 },
	{ value: "16", label: "数学特講I", season: 1, midTest: true, HW: true, examPer: 70 },
];
