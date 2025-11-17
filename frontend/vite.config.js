import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  root: "./",
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5000",
    },
  },
  build: {
    outDir: "dist", // Output directory
    emptyOutDir: true, // Clean the directory before building
  },
});
