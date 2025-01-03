import { describe } from "node:test";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-docker";
const baseTest = new BaseTest({ outputDir });

describe("no-docker", async () => {
  baseTest.globalHook({
    noDocker: true,
  });

  await baseTest.testFileList();
  await baseTest.testFileContent(".github/workflows/ci.yml");
});
