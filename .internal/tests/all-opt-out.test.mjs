import { describe } from "node:test";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "all-opt-out";
const baseTest = new BaseTest({ outputDir });

describe("all-opt-out", async () => {
  baseTest.globalHook({
    noSampleCode: true,
    noE2e: true,
    noDocker: true,
    noOtel: true,
  });

  await baseTest.testBuild(false);
});
