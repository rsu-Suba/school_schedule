import "./App.css";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import AspectDetector from "@/scripts/Misc/AspectDetector";
import PC from "@/components/PC";
import Phone from "@/components/Phone";

function App() {
   const aspectRatio = AspectDetector();
   let date: Date = new Date();
   let recentNum: number = date.getDay();
   let todayNum: number = date.getDay();
   let nowtime: number = parseInt(getCustomDate(String(date), "HHmm"));
   aspectRatio;

   //recentNum = 1;
   //todayNum = recentNum;
   //nowtime = 910;

   const CanvasProps = {
      recentNum: recentNum,
      nowtime: nowtime,
      todayNum: todayNum,
   };

   return <>{aspectRatio ? <Phone {...CanvasProps} /> : <PC {...CanvasProps} />}</>;
}

export default App;
