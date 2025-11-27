import jsonData from "@/assets/main.json";
import { subsList_Array } from "@/scripts/Data/DataPack";
import IsExamDate from "@/scripts/Change/isExamDate";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import type { jsonTimeScheduleType, GASArrayType } from "@/scripts/Data/type";
const json: jsonTimeScheduleType = jsonData.time_schedule;

export default function SubSelector(
	day: number,
	timeSelector: number,
	isChanged: boolean,
	mode: string,
	todaytext: string,
	loop: number,
	fetchedData: GASArrayType | null,
	changeNum: number,
	TestNum: number
) {
	let subjectName: string = "休み";
	if (json[String(day)][String(timeSelector)] !== undefined) {
		const subId = parseInt(json[String(day)][String(timeSelector)].toString());
		subjectName = subsList_Array[subId - 1] || "不明";
	}

	if (isChanged && mode === "main" && fetchedData && fetchedData[0][changeNum]) {
		const customDate: string = getCustomDate(todaytext, "YYYYMMDD");
		const changeData = fetchedData[0][changeNum][1];
		if (IsExamDate(customDate).TestStrNum != -1) {
			loop = changeData.length;
		} else {
			for (let n = 0; n < changeData.length; n++) {
				if (changeData[n][0] > loop) {
					loop = changeData[n][0];
					break;
				}
			}
		}
		for (let n = 0; n < loop; n++) {
			const changeSubData: [number, number, string | null] = changeData[n];
			if (changeSubData !== undefined) {
				const changeTime = IsExamDate(customDate).TestStrNum != -1 ? n : changeSubData[0];
				if (changeSubData[0] != 0) {
					if (IsExamDate(customDate).TestStrNum != -1) {
						const testSubData = changeData[TestNum];
						if (testSubData) {
							subjectName = testSubData[1] === 16 && testSubData[2] ? testSubData[2] : subsList_Array[testSubData[1] - 1];
						}
					} else {
						if (changeSubData[0] != 0 && changeTime == timeSelector) {
							subjectName = changeSubData[1] === 16 && changeSubData[2] ? changeSubData[2] : subsList_Array[changeSubData[1] - 1];
						}
					}
				}
			}
		}
	}

	const SubData = {
		subjectName: subjectName,
		loop: loop,
	};

	return SubData;
}
