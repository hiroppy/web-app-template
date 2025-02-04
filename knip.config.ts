import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // 👉 remove
  ignore: [".internal/**"],
  ///////////
  playwright: {
    config: ["playwright.config.ts"],
    entry: ["e2e/**/*.ts", "tests/**/*.ts"],
  },
  vitest: {
    entry: ["src/**/*.test.ts", "tests/**/*.ts"],
  },
  ignoreDependencies: ["postcss", "tailwindcss", "prisma-erd-generator"],
  ignoreBinaries: ["sleep"],
};

export default config;
