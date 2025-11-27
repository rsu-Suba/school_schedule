import React from "react";
import { List } from "antd";
import jsonData from "@/assets/main.json";
import { subsList_Array } from "@/scripts/Data/DataPack";
import useContexts from "@/scripts/Data/Contexts";
import IsExamDate from "@/scripts/Change/isExamDate";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import type { jsonType } from "@/scripts/Data/type";

const jsonTime: jsonType = jsonData.time;

export const ChangeList = (props: { children: React.ReactNode }) => {
	return (
		<List className="card scheCard">
			<List.Item>
				<div className="changeCard">{props.children}</div>
			</List.Item>
		</List>
	);
};

export const ChangeListMapper = (props: { mode: string; ListDate: string; data: any[] }) => {
	const subsList: string[] = subsList_Array;
	const { CardTitleContexts } = useContexts();
	const datetext: string = getCustomDate(props.ListDate, "YYYYMMDD");
	const IsExamDatePack = IsExamDate(datetext);

	if (props.mode === CardTitleContexts.ChangeInteg_SC) {
		return (
			<>
				{props.data.map((val: [number, number, string | null]) => {
					const subjectName = val[1] === 16 && val[2] ? val[2] : subsList[val[1] - 1];
					return (
						<div className="subProp">
							<p className="scheText">{subjectName}</p>
							<p className="time">{jsonTime[IsExamDatePack.TestStrNum == -1 ? 1 : 3][val[0]]}</p>
						</div>
					);
				})}
			</>
		);
	} else {
		return (
			<>
				{props.data.map((val: [string, number]) => (
					<div className="subProp">
						<p className="scheText">{val[0]}</p>
						<p className="scheText">{val[1]}</p>
					</div>
				))}
			</>
		);
	}
};

export const NoData = () => {
	const { CardInsideContexts } = useContexts();
	return (
		<ChangeList>
			<p>{CardInsideContexts.NoData}</p>
		</ChangeList>
	);
};

export const ErrorData = (props: { error: string }) => {
	return (
		<ChangeList>
			<p style={{ color: "red" }}>{props.error}</p>
		</ChangeList>
	);
};
