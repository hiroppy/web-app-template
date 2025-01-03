import react from "@vitejs/plugin-react";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

config({ path: ".env.test" });

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    include: ["./src/**/*.test.{ts,tsx}"],
    globalSetup: "./tests/vitest.setup.ts",
  },
});
