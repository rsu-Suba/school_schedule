import { List, notification, Button } from "antd";
import "@/App.css";
import jsonData from "@/assets/main.json";
import jsonScheData from "@/assets/schedule.json";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { CardBase, CardInside, LoadSkeleton, SubList, SubIcon } from "@/components/Layout/CardComp";
import TimeListProp from "@/components/Subject/TimeListProp";
import { getSub } from "@/scripts/Server/api";
import { getScheduleCache, setScheduleCache, clearScheduleCache } from "@/scripts/Server/cache";
import PastTimeChecker from "@/scripts/Misc/pastTimeChecker";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import SubSelector from "@/scripts/Subject/subSelector";
import { isChangeToday } from "@/scripts/Subject/subChangeSupporter";
import useContexts from "@/scripts/Data/Contexts";
import IsExamDate from "@/scripts/Change/isExamDate";
import type { jsonTimeScheduleType, ScheduleJSON, GASArrayType } from "@/scripts/Data/type";
import { ReloadOutlined } from "@ant-design/icons";
import { useTheme } from "@/ThemeContext";

const jsonTimeSchedule: jsonTimeScheduleType = jsonData.time_schedule;
const jsonSche: ScheduleJSON = jsonScheData;

const MemoizedSubList = React.memo(SubList);

export default function SubjectList(props: {
	recentNum: number;
	nowtime: number;
	mode: string;
	shouldFetch?: boolean;
}) {
	const { CardTitleContexts, CardInsideContexts } = useContexts();
	const theme = useTheme();
	const isPerformanceMode = theme?.isPerformanceMode ?? true; // Default to true if context is not available

	const [fetchedData, setFetchedData] = useState<GASArrayType>([[["0", [[0, 0]]]], [["0", [["0", 0]]]]]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [lastUpdated, setLastUpdated] = useState<string | null>(null);
	const [api, contextHolder] = notification.useNotification();
	const initialCacheData = useRef<string | null>(null);

	const { isChanged, changeNum, day, isTomorrow, todaytext } = isChangeToday(fetchedData, props.nowtime, props);

	const fetchAndCacheSchedule = useCallback(
		async (force: boolean = false) => {
			// --- Simple Fetch Logic (Performance Mode OFF) ---
			if (!isPerformanceMode) {
				setIsFetching(true);
				try {
					const newData = await getSub();
					setFetchedData(newData);
					setLastUpdated(new Date().toISOString());
				} catch (error) {
					console.error("Failed to fetch schedule:", error);
					api.error({
						message: "Error",
						description: "Failed to fetch new data. Please try again later.",
						placement: "topRight",
					});
				} finally {
					setIsFetching(false);
					setIsLoading(false);
				}
				return;
			}

			if (force) {
				clearScheduleCache();
			}
			setIsFetching(true);

			try {
				const newData = await getSub();
				const newDataString = JSON.stringify(newData);
				if (initialCacheData.current && initialCacheData.current !== newDataString) {
					api.info({
						message: CardTitleContexts.SubjectList_Main,
						description: CardInsideContexts.Updated,
						placement: "topRight",
						duration: 0,
					});
				}

				const newTimestamp = new Date().toISOString();
				setLastUpdated(newTimestamp);
				setScheduleCache(newData);
				setFetchedData((currentData) => {
					if (JSON.stringify(currentData) !== newDataString) {
						return newData;
					}
					return currentData;
				});
			} catch (error) {
				console.error("Failed to fetch schedule:", error);
				api.error({
					message: "Error",
					description: "Failed to fetch new data. Please try again later.",
					placement: "topRight",
				});
			} finally {
				setIsFetching(false);
				setIsLoading(false);
			}
		},
		[api, CardInsideContexts.Updated, CardTitleContexts.SubjectList_Main, isPerformanceMode]
	);

	useEffect(() => {
		if (props.shouldFetch) {
			if (isPerformanceMode) {
				const cached = getScheduleCache();
				if (cached) {
					setFetchedData(cached.data);
					setLastUpdated(cached.lastUpdated);
					initialCacheData.current = JSON.stringify(cached.data);
					setIsLoading(false);
				}
			} else {
				clearScheduleCache();
				initialCacheData.current = null;
				setIsLoading(true);
			}
			fetchAndCacheSchedule();
		} else {
			setIsLoading(false);
		}
	}, [props.shouldFetch, isPerformanceMode, fetchAndCacheSchedule]);

	const cardtext = useMemo(() => {
		let cardtext: React.ReactNode[] = [];
		let nowTime: number = props.nowtime;

		let timeList: number = 1;
		let loop: number = parseInt(jsonTimeSchedule[day].class.toString());
		if (loop == 5) {
			timeList = 2;
			loop--;
		}

		let irregular: number = 0;
		const SelectDate: string = getCustomDate(todaytext, "YYYYMMDD");
		if (props.mode === "main") {
			if (jsonSche[SelectDate] !== undefined) {
				irregular = jsonSche[SelectDate].irregular;
			}
		}
		if (
			day == 0 ||
			day == 6 ||
			(day === 5 && !isTomorrow && PastTimeChecker([timeList, loop], nowTime)) ||
			irregular == 1
		) {
			cardtext.push(
				<MemoizedSubList key="holiday">
					<h4>
						{CardInsideContexts.Holiday}
						{irregular == 1 && ` | ${jsonSche[SelectDate].schedule[0]}`}
					</h4>
				</MemoizedSubList>
			);
		} else if (irregular == 2) {
			cardtext.push(
				<MemoizedSubList key="irregular">
					<h4>{jsonSche[SelectDate].schedule[0]}</h4>
				</MemoizedSubList>
			);
		} else {
			for (let i = 0; i < loop; i++) {
				let timeSelector: number = i + 1;
				if (!isTomorrow && PastTimeChecker([timeList, timeSelector], nowTime)) {
					continue;
				} else {
					const SubData: { SubNumber: number; loop: number } = SubSelector(
						day,
						timeSelector,
						isChanged,
						props.mode,
						todaytext,
						loop,
						fetchedData,
						changeNum,
						i
					);
					const SubNumber = SubData.SubNumber;
					loop = SubData.loop;
					if (props.mode === "main") {
						const datetext: string = getCustomDate(todaytext, "YYYYMMDD");
						const IsExamDatePack = IsExamDate(datetext);
						if (IsExamDatePack.TestStrNum !== -1) {
							timeList = 3;
							timeSelector = fetchedData[0][changeNum][1][i]?.[0];
						}
					}
					cardtext.push(
						<MemoizedSubList key={`${SubNumber}-${timeSelector}-${i}`} SubNumber={SubNumber}>
							<SubIcon SubNumber={SubNumber} />
							<List.Item.Meta
								title={
									<TimeListProp
										text="title"
										SubNumber={SubNumber}
										timeSelector={[timeList, timeSelector]}
									/>
								}
								description={<TimeListProp text="desc" SubNumber={SubNumber} isTomorrow={isTomorrow} />}
							/>
						</MemoizedSubList>
					);
				}
			}
		}
		return cardtext;
	}, [
		fetchedData,
		props.nowtime,
		day,
		isChanged,
		changeNum,
		todaytext,
		isTomorrow,
		props.mode,
		CardInsideContexts.Holiday,
	]);

	const handleRefresh = () => {
		fetchAndCacheSchedule(true);
	};

	const SubjectUpdated = (
		<div className="cardTitle" style={{ marginRight: "1em" }}>
			<div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
				{lastUpdated && (
					<span style={{ fontSize: "14px", color: "#888" }}>
						{`${CardInsideContexts.LastUpdate} : ${new Date(lastUpdated).toLocaleTimeString()}`}
					</span>
				)}
				<Button type="text" icon={<ReloadOutlined spin={isFetching} />} onClick={handleRefresh} size="large" />
			</div>
		</div>
	);

	if (props.mode == "main") {
		return (
			<CardBase
				title={CardTitleContexts.SubjectList_Main}
				SubjectUpdated={isPerformanceMode ? SubjectUpdated : undefined}
			>
				{contextHolder}
				<CardInside>{isLoading ? <LoadSkeleton /> : <React.Fragment>{cardtext}</React.Fragment>}</CardInside>
			</CardBase>
		);
	} else if (props.mode == "module") {
		return <div id="card">{cardtext}</div>;
	}
}
