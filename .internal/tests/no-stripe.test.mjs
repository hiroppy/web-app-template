import { describe } from "node:test";
import {
  modifiedFiles,
  removedDirs,
  removedFiles,
} from "../setup/questions/stripe.mjs";
import { BaseTest } from "./Basetest.mjs";

const outputDir = "no-stripe";
const baseTest = new BaseTest({ outputDir });

describe("no-stripe", async () => {
  baseTest.globalHook({
    noStripe: true,
  });

  await baseTest.testFileList({ ignoreSrc: false });
  await baseTest.testFileContent(modifiedFiles);
  await baseTest.testRemovedDirs(removedDirs);
  await baseTest.testRemovedFiles(removedFiles);
  await baseTest.testDependencies();
  await baseTest.allTests({ hasE2e: true });
});
