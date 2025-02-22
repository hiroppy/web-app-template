import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    // 👉 remove
    ".internal/**",
    ///////////
    "tests/build.mjs",
  ],
  playwright: {
    config: ["playwright.config.ts"],
    entry: ["e2e/**/*.ts", "tests/**/*.ts"],
  },
  vitest: {
    entry: ["src/**/*.test.ts", "tests/**/*.ts"],
  },
  ignoreDependencies: ["tailwindcss", "prisma-erd-generator"],
  ignoreBinaries: ["sleep"],
};

export default config;
