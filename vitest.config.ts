import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { config } from "./env";

config();

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    include: ["./src/**/*.test.{ts,tsx}"],
    globalSetup: "./tests/vitest.setup.ts",
    environment: "jsdom",
    // https://github.com/nextauthjs/next-auth/discussions/9385
    server: {
      deps: {
        inline: ["next"],
      },
    },
  },
});
