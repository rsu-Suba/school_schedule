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
	{ value: "1", label: "応用物理II" },
	{ value: "2", label: "英語表現III" },
	{ value: "3", label: "解析学II" },
	{ value: "4", label: "歴史II" },
	{ value: "5", label: "アルゴリズムとデータ構造II" },
	{ value: "6", label: "電子情報工学実験IIIB" },
	{ value: "7", label: "総合国語IIIB" },
	{ value: "8", label: "総合英語III" },
	{ value: "9", label: "電子回路II" },
	{ value: "10", label: "電子情報数学III" },
	{ value: "11", label: "プログラミングIII" },
	{ value: "12", label: "電気回路II" },
	{ value: "13", label: "体育III" },
	{ value: "14", label: "総合数学" },
	{ value: "15", label: "休み" },
	{ value: "16", label: "その他" },
	{ value: "17", label: "削除" },
];
export const subsList_Array: string[] = [
	"応用物理II",
	"英語表現III",
	"解析学II",
	"歴史II",
	"アルゴリズムとデータ構造II",
	"電子情報工学実験IIIB",
	"総合国語IIIB",
	"総合英語III",
	"電子回路II",
	"電子情報数学III",
	"プログラミングIII",
	"電気回路II",
	"体育III",
	"総合数学",
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
	{ value: "1", label: "電気回路II", season: 2, midTest: true, HW: false, examPer: 100 },
	{ value: "2", label: "プログラミングIII", season: 2, midTest: true, HW: true, examPer: 70 },
	{ value: "3", label: "英語表現III", season: 0, midTest: true, HW: true, examPer: 50 },
	{ value: "4", label: "総合国語IIIB", season: 2, midTest: true, HW: true, examPer: 85 },
	{ value: "5", label: "応用物理II", season: 2, midTest: true, HW: true, examPer: 80 },
	{ value: "6", label: "電子回路II", season: 2, midTest: true, HW: true, examPer: 70 },
	{ value: "7", label: "歴史II", season: 0, midTest: true, HW: false, examPer: 100 },
	{ value: "8", label: "総合数学", season: 2, midTest: true, HW: true, examPer: 80 },
	{ value: "9", label: "総合英語III", season: 0, midTest: true, HW: true, examPer: 70 },
	{ value: "10", label: "電子情報数学III", season: 2, midTest: true, HW: true, examPer: 80 },
	{ value: "11", label: "アルゴリズムとデータ構造II", season: 2, midTest: true, HW: true, examPer: 70 },
	{ value: "12", label: "解析学II", season: 2, midTest: true, HW: true, examPer: 70 },
];
