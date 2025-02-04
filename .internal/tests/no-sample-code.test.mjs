import { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/questions/sample-code.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-sample-code";
const baseTest = new BaseTest({ outputDir });

describe("no-sample-code", async () => {
  baseTest.globalHook({
    noSampleCode: true,
  });

  await baseTest.testFileList({ ignoreSrc: false, ignoreE2e: false });
  await baseTest.testFileContent(modifiedFiles);
  await baseTest.testRemovedDirs(removedDirs);
  await baseTest.testRemovedFiles(removedFiles);

  await baseTest.testBuild();
  await baseTest.testUnit();
  await baseTest.testE2e();
});
