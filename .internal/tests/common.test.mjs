import test, { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/common-processing.mjs";
import { modifiedFiles as modifiedFilesForDocker } from "../setup/questions/docker.mjs";
import { modifiedFiles as modifiedFilesForE2e } from "../setup/questions/e2e.mjs";
import { modifiedFiles as modifiedFilesForOtel } from "../setup/questions/otel.mjs";
import { modifiedFiles as modifiedFilesForSampleCode } from "../setup/questions/sample-code.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "common";
const baseTest = new BaseTest({ outputDir });

describe("common", async () => {
  baseTest.globalHook();

  await baseTest.testFileList();
  await baseTest.testDependencies();

  test("should update package.json fields", async (t) => {
    const content = await baseTest.getPackageJson();

    t.assert.equal(content.name, baseTest.outputDir);
    t.assert.equal(content.version, "0.0.1");
  });

  const modifiedAllFiles = new Set([
    ...modifiedFiles,
    ...modifiedFilesForDocker,
    ...modifiedFilesForE2e,
    ...modifiedFilesForOtel,
    ...modifiedFilesForSampleCode,
  ]);

  await baseTest.testFileContent(modifiedAllFiles);
});
