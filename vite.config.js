import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      react(),
      VitePWA({
         registerType: "autoUpdate",
         devOptions: {
            enabled: true,
         },
         manifest: {
            name: "Schedule Hub",
            short_name: "Schedule Hub",
            description: "🫠🫠🫠",
            theme_color: "#266AFF",
            background_color: "#266AFF",
            icons: [
               {
                  src: "./logo192.png",
                  sizes: "192x192",
                  type: "image/png",
               },
               {
                  src: "./logo512.png",
                  sizes: "512x512",
                  type: "image/png",
               },
            ],
         },
         workbox: {},
      }),
   ],
   base: "./",
   build: {
      outDir: "./docs",
   },
   optimizeDeps: {
      include: ["@emotion/styled"],
   },
});
