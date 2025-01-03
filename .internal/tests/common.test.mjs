import test, { describe } from "node:test";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "common";
const baseTest = new BaseTest({ outputDir });

describe("common", async () => {
  baseTest.globalHook({
    noDocker: false,
  });

  await baseTest.testFileList();

  test("should update package.json fields", async (t) => {
    const content = await baseTest.getPackageJson();

    t.assert.equal(content.name, baseTest.outputDir);
    t.assert.equal(content.version, "0.0.1");
  });

  // remove fenced code block
  await Promise.all([
    // common
    baseTest.testFileContent("README.md"),
    baseTest.testFileContent(".gitignore"),
    // common, docker
    baseTest.testFileContent(".github/workflows/ci.yml"),
    // otel
    baseTest.testFileContent("compose.yml"),
    baseTest.testFileContent("next.config.ts"),
  ]);
});
