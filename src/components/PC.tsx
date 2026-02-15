import "@/App.css";
// import Clock from "@/components/Layout/clock";
// import SubjectList from "@/components/Subject/SubjectList";
// import Calendar from "@/components/Layout/calendar";
// import Menu from "@/components/Layout/menu";
// import ChangeInteg from "@/components/Change/ChangeInteg";
// import Timetable from "@/components/Subject/Timetable";
// import GradeChecker from "@/components/Grade/GradeChecker";
// import Update from "@/components/Update";
// import { useData } from "@/contexts/DataContext";
// import getCustomDate from "@/scripts/Misc/getCustomDate";
import InvertedCircleLens from "./InvertedCircleLens.tsx";

export default function PC() {
    // const { api: { fetchedData, isLoading } } = useData();
    // let date: Date = new Date();
    // let recentNum: number = date.getDay();
    // let todayNum: number = date.getDay();
    // let nowtime: number = parseInt(getCustomDate(String(date), "HHmm"));
    return (
        <div className="mainCanvas">
            <InvertedCircleLens
                imageUrl="https://512pixels.net/wp-content/uploads/2025/08/26-Tahoe-Beach-Day-thumb.jpeg"
                initialX={900} // 円の中心X座標
                initialY={700} // 円の中心Y座標
                width={300} // 横長に設定
                height={200} // 縦幅
                canvasWidth={2200} // Canvas（ウィンドウ）自体の幅は800px固定
                canvasHeight={1080} // Canvas（ウィンドウ）自体の高さは600px固定
                bgScale={1.1} // 背景画像を1.5倍にズーム
                bgOffsetX={0} // 左に150pxずらす
                bgOffsetY={0}
            />
            {/* <div className="PCCanvas">
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
			<Menu /> */}
        </div>
    );
}
