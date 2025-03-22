export const times_Array: { value: string; label: string }[] = [
   { value: "1", label: "1" },
   { value: "2", label: "2" },
   { value: "3", label: "3" },
   { value: "4", label: "4" },
];
export const subsListOpt_Array: { value: string; label: string }[] = [
   { value: "1", label: "コンピューターシステムII" },
   { value: "2", label: "プログラミングII" },
   { value: "3", label: "化学IIB" },
   { value: "4", label: "微分積分学II" },
   { value: "5", label: "英会話II" },
   { value: "6", label: "総合英語II" },
   { value: "7", label: "英語表現II" },
   { value: "8", label: "基礎科学実験" },
   { value: "9", label: "総合国語IIB" },
   { value: "10", label: "体育II" },
   { value: "11", label: "基礎電気II" },
   { value: "12", label: "線形代数II" },
   { value: "13", label: "電子情報工学実験IIB" },
   { value: "14", label: "物理学IIB" },
   { value: "15", label: "歴史I" },
   { value: "16", label: "休み" },
   { value: "17", label: "その他" },
   { value: "18", label: "削除" },
];
export const subsList_Array: string[] = [
   "コンピューターシステムII",
   "プログラミングII",
   "化学IIB",
   "微分積分学II",
   "英会話II",
   "総合英語II",
   "英語表現II",
   "基礎科学実験",
   "総合国語IIB",
   "体育II",
   "基礎電気II",
   "線形代数II",
   "電子情報工学実験IIB",
   "物理学IIB",
   "歴史I",
   "休み",
   "その他",
   "削除",
];

export const testDates: string[] = [
   "2025/1/30",
   "2025/1/31",
   "2025/2/3",
   "2025/2/4",
   "2025/2/5",
   "2025/2/6",
   "2025/2/12",
   "2025/2/13",
];
export const languages: { value: string; label: string }[] = [
   { value: "ja", label: "日本語" },
   { value: "en", label: "English" },
];
export const accentsColors: string[] = ["#007AFF", "#AF52DE", "#FF3B30", "#FFCC00", "#34C759", "#8E8E93"];

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
   { value: "1", label: "コンピューターシステムII", season: 2, midTest: false, HW: true, examPer: 70 },
   { value: "2", label: "プログラミングII", season: 2, midTest: false, HW: true, examPer: 70},
   { value: "3", label: "化学IIB", season: 2, midTest: true, HW: true, examPer: 80},
   { value: "4", label: "微分積分学II", season: 2, midTest: true, HW: true, examPer: 70},
   { value: "5", label: "英会話II", season: 0, midTest: true, HW: false, examPer: 80},
   { value: "6", label: "総合英語II", season: 0, midTest: true, HW: true, examPer: 80},
   { value: "7", label: "英語表現II", season: 0, midTest: true, HW: true, examPer: 60},
   { value: "8", label: "総合国語IIB", season: 2, midTest: false, HW: true, examPer: 70},
   { value: "9", label: "基礎電気II", season: 2, midTest: true, HW: true, examPer: 70},
   { value: "10", label: "線形代数II", season: 2, midTest: true, HW: true, examPer: 80},
   { value: "11", label: "物理学IIB", season: 2, midTest: true, HW: true, examPer: 80},
   { value: "12", label: "歴史I", season: 0, midTest: true, HW: false, examPer: 100},
];
