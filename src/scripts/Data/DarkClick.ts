import { postCookie } from "@/scripts/Server/Cookie";

export default function DarkClick(isDarkMode: boolean) {
   postCookie("dark", !isDarkMode);
   darkSet(isDarkMode);
}

function darkSet(isDarkMode: boolean) {
   const root = document.querySelector(":root")! as HTMLElement;
   if (isDarkMode) {
      //root.style.setProperty("--main-color", "#1677ff");
      root.style.setProperty("--bg-color", "#fff");
      root.style.setProperty("--bg-sub-color", "#ddd");
      root.style.setProperty("--mainCanvas-color", "#f4f7fc");
      root.style.setProperty("--text-color", "#000");
      root.style.setProperty("--text-sub-color", "rgba(0, 0, 0, 0.65)");
      root.style.setProperty("--clock-color", "#556");
      root.style.setProperty("--border-color", "#ccc");
      root.style.setProperty("--shadow-out", "rgba(0, 0, 0, 0.2) 0 0 1.8vh");
      root.style.setProperty("--shadow-in", "inset #ddd 0 0 0.7vh 0.2vh");
      root.style.setProperty("--input-color", "rgba(255, 255, 255, 0.6)");
      root.style.setProperty("--disable-day-color", "rgba(0, 0, 0, 0.25)");
      root.style.setProperty("--scheme", "light");
   } else {
      //root.style.setProperty("--main-color", "#6fabff");
      root.style.setProperty("--bg-color", "#18181a");
      root.style.setProperty("--bg-sub-color", "#39383c");
      root.style.setProperty("--mainCanvas-color", "#000");
      root.style.setProperty("--text-color", "#fff");
      root.style.setProperty("--text-sub-color", "#rgba(255, 255, 255, 0.65)");
      root.style.setProperty("--clock-color", "#97969c");
      root.style.setProperty("--border-color", "#3a3a3b");
      root.style.setProperty("--shadow-out", "rgba(240, 240, 240, 0.3) 0 0 1.2vh");
      root.style.setProperty("--shadow-in", "inset #070708 0 0 1vh 0.2vh");
      root.style.setProperty("--input-color", "rgba(0, 0, 0, 0.6)");
      root.style.setProperty("--disable-day-color", "rgba(255, 255, 255, 0.25)");
      root.style.setProperty("--scheme", "dark");
   }
}
