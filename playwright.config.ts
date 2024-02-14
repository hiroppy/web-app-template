import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/globalSetup.ts",
  globalTeardown: "./e2e/globalTeardown.ts",
  fullyParallel: true,
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,
    storageState: "./e2e/storageState.json",
  },
  webServer: {
    command: "pnpm start",
    port: 3000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        launchOptions: {
          args: [],
        },
      },
    },
  ],
});
