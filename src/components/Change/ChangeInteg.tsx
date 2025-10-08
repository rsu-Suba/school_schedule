import ChangeCard from "@/components/Change/ChangeCard";
import useContexts from "@/scripts/Data/Contexts";
import { useData } from "@/contexts/DataContext";

export default function ChangeInteg() {
	const { CardTitleContexts } = useContexts();
	const { api: { fetchedData, hwDataForUI }, work: { timeWorkState } } = useData();
	const subData = fetchedData ? fetchedData[0] : [];
	const hwData = hwDataForUI;

	const scPostMode = 0;

	if (!hwData) {
		return null;
	}

	const allHomeworks = hwData.flatMap(item => item[1]);
	const timeOptions = allHomeworks.map(([_, id]) => ({ value: String(id), label: String(id) }));

	return (
		<div className="changeMix">
			<ChangeCard
				card={CardTitleContexts.ChangeInteg_HW}
				postMode={timeWorkState === "0" ? 1 : 2}
				data={hwData}
				timeOptions={timeOptions}
				showInput={timeWorkState === "0"}
			/>
			<ChangeCard
				card={CardTitleContexts.ChangeInteg_SC}
				postMode={scPostMode}
				data={subData}
			/>
		</div>
	);
}
