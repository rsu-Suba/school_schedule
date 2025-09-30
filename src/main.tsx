import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@/i18n/i18n";
import { ThemeProvider } from "./ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);
