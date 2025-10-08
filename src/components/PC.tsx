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

export default function PC() {
	const { api: { fetchedData, isLoading } } = useData();
	let date: Date = new Date();
	let recentNum: number = date.getDay();
	let todayNum: number = date.getDay();
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
