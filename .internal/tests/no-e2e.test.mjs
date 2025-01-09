import { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/questions/e2e.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-e2e";
const baseTest = new BaseTest({ outputDir });

describe("no-e2e", async () => {
  baseTest.globalHook({
    noE2e: true,
  });

  await baseTest.testFileList({ ignoreE2e: true });
  await baseTest.testFileContent(modifiedFiles);
  await baseTest.testRemovedDirs(removedDirs);
  await baseTest.testRemovedFiles(removedFiles);
  await baseTest.testDependencies();
  await baseTest.testNpmScripts();
});
