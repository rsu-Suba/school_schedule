import "./App.css";
import AspectDetector from "@/scripts/Misc/AspectDetector";
import PC from "@/components/PC";
import Phone from "@/components/Phone";
import { DataProvider } from "@/contexts/DataProvider";

function App() {
	const aspectRatio = AspectDetector();
	const baseDate = new Date(); 

	return (
		<DataProvider>
			{aspectRatio ? <Phone baseDate={baseDate} /> : <PC baseDate={baseDate} />}
		</DataProvider>
	);
}

export default App;