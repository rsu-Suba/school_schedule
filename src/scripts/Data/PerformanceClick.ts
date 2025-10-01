import { postCookie } from "@/scripts/Server/Cookie";

export default function performanceModeClick(newMode: boolean) {
	postCookie("performanceMode", newMode);
}
