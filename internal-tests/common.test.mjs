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

  await baseTest.testFileContent("README.md");
  await baseTest.testFileContent(".gitignore");
  await baseTest.testFileContent(".github/workflows/ci.yml");
});
