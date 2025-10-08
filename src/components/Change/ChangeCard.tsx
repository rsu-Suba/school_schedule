import "dayjs/locale/ja";
import { CardBase, CardInside, LoadSkeleton } from "@/components/Layout/CardComp";
import { ChangeList, ChangeListMapper, NoData, ErrorData } from "@/components/Change/ChangeResult";
import ChangeController from "@/components/Change/ChangeController";
import getCustomDate from "@/scripts/Misc/getCustomDate";
import useContexts from "@/scripts/Data/Contexts";
import type { GASArraySubMapType, GASArrayHWMapType, GASArraySubType, GASArrayHWType } from "@/scripts/Data/type";

import { useData } from "@/contexts/DataContext";

type ChangeCardType = {
	card: string;
	postMode: number;
	data: GASArraySubType | GASArrayHWType;
	timeOptions?: { value: string; label: string }[];
	showInput?: boolean;
};

export default function ChangeCard({ card, postMode, data, timeOptions, showInput }: ChangeCardType) {
	const { CardTitleContexts, CardInsideContexts } = useContexts();
	const {
		api: { isLoading, error },
	} = useData();

	const isSC = card === CardTitleContexts.ChangeInteg_SC;
	return (
		<CardBase title={card}>
			<div className="cardChanged" id="card">
				<ChangeController
					isSC={isSC}
					postMode={postMode}
					timeOptions={timeOptions || []}
					showInput={showInput || false}
				/>
				<div>
					{isLoading ? (
						<CardInside>
							<LoadSkeleton />
						</CardInside>
					) : error ? (
						<ErrorData error={CardInsideContexts.FailedFetch} />
					) : data[0] ? (
						<div>
							{data.map((date: GASArraySubMapType | GASArrayHWMapType) => (
								<ChangeList>
									<p className="scheText">{getCustomDate(date[0], "MM/DD")}</p>
									<ChangeListMapper mode={card} ListDate={date[0]} data={date[1]} />
								</ChangeList>
							))}
						</div>
					) : (
						<NoData />
					)}
				</div>
			</div>
		</CardBase>
	);
}
