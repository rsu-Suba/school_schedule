import "./App.css";
import AspectDetector from "@/scripts/Misc/AspectDetector";
import PC from "@/components/PC";
import Phone from "@/components/Phone";
import { DataProvider } from "@/contexts/DataProvider";

function App() {
	const aspectRatio = AspectDetector();

	return (
		<DataProvider>
			{aspectRatio ? <Phone /> : <PC />}
		</DataProvider>
	);
}

export default App;