/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // environment: "jsdom",
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    include: ["./src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src`,
    },
  },
});
