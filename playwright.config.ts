import { defineConfig, devices } from "@playwright/test";
import { config } from "./env";

config();

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  projects: [
    {
      name: "setup",
      testMatch: /.\/e2e\/setup\/.*.ts/,
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
