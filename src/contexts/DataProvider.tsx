import React, { useState, useEffect, useRef } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DataContext, DataContextType } from "./DataContext";
import { getData, postData } from "@/scripts/Server/api";
import type { GASArrayType, GASArrayHWType } from "@/scripts/Data/type";

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
	const [fetchedData, setFetchedData] = useState<GASArrayType | null>(null);
	const [hwDataForUI, setHwDataForUI] = useState<GASArrayHWType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isPosting, setIsPosting] = useState(false);
	const [isWorkPosting, setIsWorkPosting] = useState(false);
	const [error, setError] = useState("");

	const [date, setDate] = useState<Dayjs>(dayjs());
	const [dateWork, setDateWork] = useState<Dayjs>(dayjs());
	const [time, setTime] = useState("1");
	const [timeWorkState, setTimeWorkState] = useState("0");
	const [sub, setSub] = useState("0");
	const [textOther, setOtherText] = useState("");
	const [textWork, setWorkText] = useState("");

	const idMap = useRef<Map<number, number>>(new Map());

	const fetchData = async () => {
		try {
			setError("");
			const data = await getData();
			setFetchedData(data);
			const originalHwData = data[1];
			const newIdMap = new Map<number, number>();
			let sequentialId = 1;
			const newHwDataForUI = originalHwData.map(dailyHw => {
				const newValues = dailyHw[1].map(hw => {
					const supabaseId = hw[1];
					newIdMap.set(sequentialId, supabaseId);
					return [hw[0], sequentialId++];
				});
				return [dailyHw[0], newValues] as [string, [string, number][]];
			});

			idMap.current = newIdMap;
			setHwDataForUI(newHwDataForUI);

		} catch (e) {
			console.error(e);
			setError("Failed to fetch data");
		} finally {
			setIsLoading(false);
		}
	};

	const getSupabaseId = (sequentialId: number) => {
		return idMap.current.get(sequentialId);
	};

	const handlePost = (mode: number) => {
		let supabaseId: number | undefined;
		if (mode === 2) {
			supabaseId = getSupabaseId(Number(timeWorkState));
		}

		postData({
			mode,
			setIsPosting,
			setIsWorkPosting,
			setError,
			get: fetchData,
			time,
			sub,
			textOther,
			textWork,
			setWorkText,
			homeworkIdToDelete: supabaseId,
		});

		if (mode === 2) {
			setTimeWorkState("0");
		}

        if (mode === 0 && sub === "15") {
            setOtherText("");
        }
	};

	useEffect(() => {
		fetchData();
	}, []);

	const value: DataContextType = {
		api: {
			fetchedData,
			hwDataForUI,
			isLoading,
			isPosting,
			isWorkPosting,
			error,
			fetchData,
			handlePost,
		},
		change: {
			date,
			setDate,
			time,
			setTime,
			sub,
			setSub,
			textOther,
			setOtherText,
		},
		work: {
			dateWork,
			setDateWork,
			timeWorkState,
			setTimeWorkState,
			textWork,
			setWorkText,
			getSupabaseId,
		},
	};

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
