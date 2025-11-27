import { List, Button } from "antd";
import "@/App.css";
import jsonData from "@/assets/main.json";
import jsonScheData from "@/assets/schedule.json";
import React, { useMemo } from "react";
import { CardBase, CardInside, LoadSkeleton, SubList, SubIcon } from "@/components/Layout/CardComp";
import TimeListProp from "@/components/Subject/TimeListProp";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import PastTimeChecker from "@/scripts/Misc/pastTimeChecker";
import SubSelector from "@/scripts/Subject/subSelector";
import { isChangeToday } from "@/scripts/Subject/subChangeSupporter";
import useContexts from "@/scripts/Data/Contexts";
import IsExamDate from "@/scripts/Change/isExamDate";
import { ReloadOutlined } from "@ant-design/icons";
import type { GASArrayType, jsonTimeScheduleType, ScheduleJSON } from "@/scripts/Data/type";
import { useTheme } from "@/ThemeContext";
import { subsList_Array } from "@/scripts/Data/DataPack";

const jsonTimeSchedule: jsonTimeScheduleType = jsonData.time_schedule;
const jsonSche: ScheduleJSON = jsonScheData;

const MemoizedSubList = React.memo(SubList);

export default function SubjectList(props: {
	recentNum: number;
	nowtime: number;
	mode: string;
	fetchedData: GASArrayType | null;
	isLoading: boolean;
	onRefresh?: () => void;
}) {
	const { CardTitleContexts, CardInsideContexts } = useContexts();
	const theme = useTheme();
	const isPerformanceMode = theme?.isPerformanceMode ?? true;

	const changeInfo = useMemo(() => {
		if (!props.fetchedData) {
			if (props.mode == "main") {
				return {
					isChanged: false,
					changeNum: 0,
					day: new Date().getDay(),
					isTomorrow: false,
					todaytext: "",
				};
			} else {
				return {
					isChanged: false,
					changeNum: 0,
					day: props.recentNum,
					isTomorrow: false,
					todaytext: "",
				};
			}
		}
		return isChangeToday(props.fetchedData, props.nowtime, props);
	}, [props.fetchedData, props.nowtime]);

	const { isChanged, changeNum, day, isTomorrow, todaytext } = changeInfo;

	const cardtext = useMemo(() => {
		const data = props.fetchedData;
		if (props.mode == "main") {
			if (!data || data.length < 2 || !data[0] || !data[1]) return [];
		}
		const cards: React.ReactNode[] = [];
		let nowTime = props.nowtime;
		let timeList = 1;
		let loop = parseInt(jsonTimeSchedule[day].class.toString());
		if (loop === 5) {
			timeList = 2;
			loop--;
		}
		const SelectDate = getCustomDate(todaytext, "YYYYMMDD");
		let irregular = 0;
		if (props.mode === "main" && jsonSche[SelectDate]) {
			irregular = jsonSche[SelectDate].irregular;
		}
		if (
			day === 0 ||
			day === 6 ||
			(day === 5 && !isTomorrow && PastTimeChecker([timeList, loop], nowTime)) ||
			irregular === 1
		) {
			cards.push(
				<MemoizedSubList key="holiday">
					<h4>
						{CardInsideContexts.Holiday}
						{irregular === 1 && ` | ${jsonSche[SelectDate].schedule[0]}`}
					</h4>
				</MemoizedSubList>
			);
		} else if (irregular === 2) {
			cards.push(
				<MemoizedSubList key="irregular">
					<h4>{jsonSche[SelectDate].schedule[0]}</h4>
				</MemoizedSubList>
			);
		} else {
			for (let i = 0; i < loop; i++) {
				let timeSelector = i + 1;
				if (!isTomorrow && PastTimeChecker([timeList, timeSelector], nowTime)) continue;

				const SubData = SubSelector(
					day,
					timeSelector,
					isChanged,
					props.mode,
					todaytext,
					loop,
					data,
					changeNum,
					i
				);
				const { subjectName } = SubData;
				loop = SubData.loop;

				const subIndex = subsList_Array.indexOf(subjectName);
				const SubNumber = subIndex !== -1 ? subIndex + 1 : undefined;

				if (props.mode === "main") {
					const IsExamDatePack = IsExamDate(getCustomDate(todaytext, "YYYYMMDD"));
					if (IsExamDatePack.TestStrNum !== -1) {
						timeList = 3;
						if (data && data[0][changeNum] && data[0][changeNum][1][i]) {
							timeSelector = data[0][changeNum][1][i][0];
						}
					}
				}
				cards.push(
					<MemoizedSubList key={`${subjectName}-${timeSelector}-${i}`} SubNumber={SubNumber}>
						{SubNumber !== undefined && <SubIcon SubNumber={SubNumber} />}
						<List.Item.Meta
							title={
								<TimeListProp
									text="title"
									subjectName={subjectName}
									timeSelector={[timeList, timeSelector]}
								/>
							}
							description={<TimeListProp text="desc" subjectName={subjectName} isTomorrow={isTomorrow} />}
						/>
					</MemoizedSubList>
				);
			}
		}
		return cards;
	}, [
		props.fetchedData,
		props.nowtime,
		day,
		isChanged,
		changeNum,
		todaytext,
		isTomorrow,
		props.mode,
		CardInsideContexts.Holiday,
	]);

	const SubjectUpdated = isPerformanceMode && props.onRefresh && (
		<div className="cardTitle" style={{ marginRight: "1em" }}>
			<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
				<Button type="text" icon={<ReloadOutlined />} onClick={props.onRefresh} size="large" />
			</div>
		</div>
	);

	if (props.mode === "main") {
		return (
			<CardBase title={CardTitleContexts.SubjectList_Main} SubjectUpdated={SubjectUpdated}>
				<CardInside>{props.isLoading ? <LoadSkeleton /> : <>{cardtext}</>}</CardInside>
			</CardBase>
		);
	} else if (props.mode === "module") {
		return <div id="card">{props.isLoading ? <LoadSkeleton /> : <>{cardtext}</>}</div>;
	}

	return null;
}
