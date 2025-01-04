import { describe } from "node:test";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-e2e";
const baseTest = new BaseTest({ outputDir });

describe("no-e2e", async () => {
  baseTest.globalHook({
    noE2e: true,
  });

  await baseTest.testFileList({ ignoreE2e: true });
  await baseTest.testFileContent(".gitignore");
  await baseTest.testFileContent("README.md");
  await baseTest.testFileContent(".github/workflows/ci.yml");
  await baseTest.testDependencies();
  await baseTest.testNpmScripts();
});
