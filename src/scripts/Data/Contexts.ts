import { useTranslation } from "react-i18next";

export default function useContexts() {
	const { t } = useTranslation();
	return {
		InfoContexts: {
			PlannedFeatures: "Technical Optimization.",
			UpdateTitle: "Peak performance.",
			UpdateVersion: "10.8.25",
		},
		UpdateContexts: {
			date: "Oct 8",
			title: "パフォーマンスモードを廃止",
			texts: [
				"・次の教科タブのパフォーマンスモードを1週間で廃止しました✅️",
				"・データサーバを変えたところ爆速になった",
				"・Google Apps Script → Supabase",
			],
		},
		CardTitleContexts: {
			SubjectList_Main: t("CardTitleContexts.SubjectList_Main"),
			SubjectList_Module: t("CardTitleContexts.SubjectList_Module"),
			ChangeInteg_SC: t("CardTitleContexts.ChangeInteg_SC"),
			ChangeInteg_HW: t("CardTitleContexts.ChangeInteg_HW"),
			Calendar_MonthlyList: t("CardTitleContexts.Calendar_MonthlyList"),
			Settings: t("CardTitleContexts.Settings"),
			PlannedFeatures: t("CardTitleContexts.PlannedFeatures"),
			Info: t("CardTitleContexts.Info"),
			Credit: t("CardTitleContexts.Credit"),
		},
		CardInsideContexts: {
			NoData: t("CardInsideContexts.NoData"),
			FailedFetch: t("CardInsideContexts.FailedFetch"),
			NoSchedule: t("CardInsideContexts.NoSchedule"),
			Holiday: t("CardInsideContexts.Holiday")
		},
		ButtonContexts: {
			Update: t("ButtonContexts.Update"),
			Change: t("ButtonContexts.Change"),
			Submit: t("ButtonContexts.Submit"),
			Delete: t("ButtonContexts.Delete"),
		},
		SettingsContexts: {
			DarkTheme: t("Settings.DarkTheme"),
			Color: t("Settings.Color"),
			Language: t("Settings.Language"),
		},
		Credit: {
			Subject: t("Credit.Subject"),
			Test: t("Credit.Test"),
			MidTest: t("Credit.MidTest"),
			FinalTest: t("Credit.FinalTest"),
			HW: t("Credit.HW"),
			Score: t("Credit.Score"),
			Credit: t("Credit.Credit"),
			Year: t("Credit.Year"),
			FirstH: t("Credit.FirstH"),
			SecondH: t("Credit.SecondH"),
		},
	};
}
