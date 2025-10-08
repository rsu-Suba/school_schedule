import React from "react";
import "@/App.css";
import Settings from "@/components/Misc/Settings";
import { CardBase, CardInside, SubList } from "@/components/Layout/CardComp";
import useContexts from "@/scripts/Data/Contexts";

function cardMake(title: string, children: React.ReactNode) {
	return (
		<CardBase title={title}>
			<CardInside>
				<SubList>
					<div className="cardRight othercardtext">{children}</div>
				</SubList>
			</CardInside>
		</CardBase>
	);
}

export default function Other() {
	const { CardTitleContexts, InfoContexts, UpdateContexts } = useContexts();

	return (
		<div className="drawerBar">
			<Settings />
			{cardMake(
				`Update (${UpdateContexts.date})`,
				<div className="allow-wrap">
					<h3>{UpdateContexts.title}</h3>
					{UpdateContexts.texts.map((text, index) => (
						<h4 key={index}>{text}</h4>
					))}
				</div>
			)}
			{cardMake(CardTitleContexts.PlannedFeatures, [
				<div className="subProp">
					<p className="othercardsub">・{InfoContexts.PlannedFeatures}</p>
				</div>,
			])}
			{cardMake(CardTitleContexts.Info, [
				<p className="othercardsub">
					・
					<a href="https://github.com/rsu-Suba/school_schedule" target="_blank">
						Repository
					</a>
				</p>,
				<p className="infoText">
					<a href="https://ja.react.dev/" target="_blank">
						React
					</a>
					,&nbsp;
					<a href="https://ant.design/" target="_blank">
						Ant Design
					</a>
					, TypeScript,&nbsp;
					<a href="https://supabase.com/" target="_blank">
						Supabase
					</a>
					,&nbsp;
					<a
						href="https://blog.google/technology/developers/introducing-gemini-cli-open-source-ai-agent/"
						target="_blank"
					>
						Gemini CLI
					</a>
				</p>,
				<p className="infoText">
					Made by{" "}
					<a href="https://github.com/rsu-Suba" target="_blank">
						rsu-Suba
					</a>
				</p>,
				<h4 className="lastText" style={{ textAlign: "right" }}>
					{InfoContexts.UpdateTitle} {InfoContexts.UpdateVersion}
				</h4>,
			])}
		</div>
	);
}
