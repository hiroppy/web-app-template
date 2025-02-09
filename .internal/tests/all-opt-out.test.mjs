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
    noStripe: true,
  });

  await baseTest.allTests({ hasE2e: false });
});
