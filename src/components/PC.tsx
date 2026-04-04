import "@/App.css";
import Clock from "@/components/Layout/clock";
import SubjectList from "@/components/Subject/SubjectList";
import Calendar from "@/components/Layout/calendar";
import Menu from "@/components/Layout/menu";
import ChangeInteg from "@/components/Change/ChangeInteg";
import Timetable from "@/components/Subject/Timetable";
import GradeChecker from "@/components/Grade/GradeChecker";
import Update from "@/components/Update";
import { useData } from "@/contexts/DataContext";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import dayjs from "dayjs";
import jsonData from "@/assets/schedule.json";
import { getDayStatus } from "@/scripts/Data/ScheduleProcessor";
import type { NewScheduleData } from "@/scripts/Data/type";

const jsonSche: NewScheduleData = jsonData as unknown as NewScheduleData;

export default function PC(props: { baseDate: Date }) {
    const {
        api: { fetchedData, isLoading },
    } = useData();
    let date: Date = props.baseDate;
    let status = getDayStatus(dayjs(date), jsonSche);
    let recentNum: number = status.appliedDay;
    let todayNum: number = status.appliedDay;
    let nowtime: number = parseInt(getCustomDate(String(date), "HHmm"));
    return (
        <div className="mainCanvas">
            <div className="PCCanvas">
                <Update />
                <div className="main" id="main">
                    <div className="mainCards">
                        <Clock />
                        <SubjectList
                            recentNum={recentNum}
                            nowtime={nowtime}
                            mode={"main"}
                            fetchedData={fetchedData!}
                            isLoading={isLoading}
                            baseDate={date}
                        />
                        <ChangeInteg />
                        <GradeChecker />
                        <Timetable num={todayNum} />
                    </div>
                </div>
                <div className="sche" id="sche">
                    <Calendar />
                </div>
            </div>
            <Menu />
        </div>
    );
}

