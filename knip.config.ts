import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [".internal/**"],
  playwright: {
    config: ["playwright.config.ts"],
    entry: ["e2e/**/*.ts"],
  },
  ignoreDependencies: ["prisma-erd-generator"],
  ignoreBinaries: ["sleep"],
};

export default config;
