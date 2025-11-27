import React from 'react';
import jsonData from "@/assets/main.json";
import jsonScheData from "@/assets/schedule.json";
import { SubChangeSupporter } from "@/scripts/Subject/subChangeSupporter";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import getTodayDate from "@/scripts/Misc/getTodayDate";
import IsExamDate from "@/scripts/Change/isExamDate";
import type { jsonType, ScheduleJSON } from "@/scripts/Data/type";

const jsonTime: jsonType = jsonData.time;
const jsonSche: ScheduleJSON = jsonScheData;

const TimeListProp = React.memo((props: {
    text: string;
    subjectName: string;
    timeSelector?: number[];
    isTomorrow?: boolean;
}) => {
    const SupportData: { subName: string; textbook: string } = SubChangeSupporter({
        text: props.text,
        subjectName: props.subjectName,
    });
    if (props.text == "title") {
        const time: string = jsonTime[props.timeSelector![0]][props.timeSelector![1]];
        return (
            <div className="subProp">
                <p className="subName">{SupportData.subName}</p>
                <p className="time">{time}</p>
            </div>
        );
    } else {
        const getDate: string = getTodayDate(props.isTomorrow ? 1 : 0);
        const date: string = getCustomDate(getDate, "YYYYMMDD");
        if (jsonSche[date] === undefined) {
            return (
                <p className="textbook" style={{ color: "rgba(0, 0, 0, 0.65" }}>
                    {SupportData.textbook}
                </p>
            );
        } else {
            const { TestStrNum, resultStr }: { TestStrNum: number; resultStr: string } = IsExamDate(date);
            return (
                <p className="textbook" style={{ color: "rgba(0, 0, 0, 0.65" }}>
                    {TestStrNum !== -1 ? resultStr : SupportData.textbook}
                </p>
            );
        }
    }
});

export default TimeListProp;
