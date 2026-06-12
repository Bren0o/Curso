import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Em dev, o backend roda na 3000 (cd server && npm start)
    proxy: { "/api": "http://localhost:3000" },
  },
});
