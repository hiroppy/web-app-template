import { describe } from "node:test";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-otel";
const baseTest = new BaseTest({ outputDir });

describe("no-otel", async () => {
  baseTest.globalHook({
    noOtel: true,
  });

  await baseTest.testFileList();
  await baseTest.testFileContent("compose.yml");
  await baseTest.testFileContent("next.config.ts");
  await baseTest.testRemovedSrcFiles(["instrumentation.ts", "otel/node.ts"]);
  await baseTest.testDependencies();
});
