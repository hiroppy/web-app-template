import { defineConfig, devices } from "@playwright/test";
import { config } from "./env";

config(".env.test");

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/globalSetup.ts",
  globalTeardown: "./e2e/globalTeardown.ts",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  webServer: {
    command: "pnpm start",
    port: 3000,
    reuseExistingServer: true,
    stdout: "pipe",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.\/e2e\/setup\/.*.ts/,
      fullyParallel: true,
    },
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        launchOptions: {
          args: [],
        },
      },
      dependencies: ["setup"],
    },
  ],
});
