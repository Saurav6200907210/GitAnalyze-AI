import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/scheduler/") ||
              id.includes("node_modules/@remix-run/router/")
            ) {
              return "react-core";
            }
            if (id.includes("node_modules/recharts/")) {
              return "recharts";
            }
            if (id.includes("node_modules/framer-motion/")) {
              return "framer-motion";
            }
          }
        },
      },
    },
  },
});
