import { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/questions/otel.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-otel";
const baseTest = new BaseTest({ outputDir });

describe("no-otel", async () => {
  baseTest.globalHook({
    noOtel: true,
  });

  await baseTest.testFileList();
  await baseTest.testFileContent(modifiedFiles);
  await baseTest.testRemovedDirs(removedDirs);
  await baseTest.testRemovedFiles(removedFiles);
  await baseTest.testDependencies();
  // await baseTest.allTests({ hasE2e: true });
});
