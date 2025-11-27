import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { Dayjs } from "dayjs";
import type { GASArrayType, GASArrayHWType } from "@/scripts/Data/type";

export type DataContextType = {
	api: {
		fetchedData: GASArrayType | null;
		hwDataForUI: GASArrayHWType | null;
		isLoading: boolean;
		isPosting: boolean;
		isWorkPosting: boolean;
		error: string;
		fetchData: () => Promise<void>;
		handlePost: (mode: number) => void;
	};
	change: {
		date: Dayjs;
		setDate: Dispatch<SetStateAction<Dayjs>>;
		time: string;
		setTime: Dispatch<SetStateAction<string>>;
		sub: string;
		setSub: Dispatch<SetStateAction<string>>;
		textOther: string;
		setOtherText: Dispatch<SetStateAction<string>>;
	};
	work: {
		dateWork: Dayjs;
		setDateWork: Dispatch<SetStateAction<Dayjs>>;
		timeWorkState: string;
		setTimeWorkState: Dispatch<SetStateAction<string>>;
		textWork: string;
		setWorkText: Dispatch<SetStateAction<string>>;
		getSupabaseId: (sequentialId: number) => number | undefined;
	};
};

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
	const context = useContext(DataContext);
	if (!context) {
		throw new Error("useData must be used within a DataProvider");
	}
	return context;
};
