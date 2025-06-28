import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeNpmScripts,
} from "../utils.mjs";

export const removedFiles = /** @type {const} */ (["playwright.config.ts"]);

export const removedDirs = /** @type {const} */ (["e2e"]);

export const modifiedFiles = /** @type {const} */ ([
  ".gitignore",
  ".github/workflows/ci.yml",
  "README.md",
]);

export async function e2e(answer, isSkipQuestion) {
  const fences = [
    ["# start: e2e #", "# end: e2e #"],
    ["<!-- start: e2e -->", "<!-- end: e2e -->"],
  ];

  await executeOptionalQuestion({
    question: "> Do you want to remove e2e test? (y/N) ",
    answer,
    isSkipQuestion,
    codeAndFenceList: [
      [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[0]],
      [modifiedFiles[2], fences[1]],
    ],
    yesCallback: async () => {
      await getPackageJson();
      const deps = ["@playwright/test", "@axe-core/playwright"];

      await Promise.all([
        removeFiles(removedFiles),
        removeDirs(removedDirs),
        removeDeps(deps),
      ]);

      // avoid dead-lock
      await removeNpmScripts(["build:test", "test:e2e", "test:e2e:ui"]);
    },
  });
}
