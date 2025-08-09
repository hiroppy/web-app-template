import { defineConfig } from "vitest/config";
import { config } from "./env";

config();

export default defineConfig(async () => {
  const react = await import("@vitejs/plugin-react");
  return {
    plugins: [react.default()],
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
  };
});
