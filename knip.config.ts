import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    // 👉 remove
    ".internal/**",
    ///////////
    "tests/build.mjs",
    "prisma.config.ts",
  ],
  playwright: {
    config: ["playwright.config.ts"],
    entry: ["e2e/**/*.ts"],
  },
  vitest: {
    entry: ["src/**/*.test.ts"],
  },
  ignoreDependencies: ["postcss", "tailwindcss"],
  ignoreBinaries: ["stripe"],
};

export default config;
