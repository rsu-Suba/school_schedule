import "@/App.css";
import Clock from "@/components/Layout/clock";
import SubjectList from "@/components/Subject/SubjectList";
import Calendar from "@/components/Layout/calendar";
import Other from "@/components/Layout/other";
import ChangeInteg from "@/components/Change/ChangeInteg";
import Timetable from "@/components/Subject/Timetable";
import BottomNavigator from "@/components/Layout/Bottom";
import GradeChecker from "@/components/Grade/GradeChecker";
import Update from "@/components/Update";
import { useData } from "@/contexts/DataContext";
import getCustomDate from "@/scripts/Misc/getCustomDate";

export default function Phone() {
	const {
		api: { fetchedData, isLoading },
	} = useData();
	let date: Date = new Date();
	let recentNum: number = date.getDay();
	let todayNum: number = date.getDay();
	let nowtime: number = parseInt(getCustomDate(String(date), "HHmm"));

	return (
		<div className="mainCanvas">
			<div className="canvas" id="canvas">
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
						<div className="blankCard"></div>
					</div>
				</div>
				<div className="sche" id="sche">
					<Calendar />
				</div>
				<div className="others" id="others">
					<div className="otherCards">
						<Other />
					</div>
				</div>
			</div>
			<div className="bottomCanvas">
				<BottomNavigator />
			</div>
		</div>
	);
}
