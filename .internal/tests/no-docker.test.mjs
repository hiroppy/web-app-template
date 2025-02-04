import { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/questions/docker.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-docker";
const baseTest = new BaseTest({ outputDir });

describe("no-docker", async () => {
  baseTest.globalHook({
    noDocker: true,
  });

  await baseTest.testFileList();
  await baseTest.testFileContent(modifiedFiles);
  await baseTest.testRemovedDirs(removedDirs);
  await baseTest.testRemovedFiles(removedFiles);
  await baseTest.allTests({ hasE2e: true });
});
