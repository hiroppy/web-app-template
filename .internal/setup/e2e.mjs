import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeLines,
  removeNpmScripts,
  removeWords,
} from "./utils.mjs";

export async function e2e(answer, isSkipQuestion) {
  const fences = [
    ["####### e2e #######", "########################"],
    ["/***** e2e *****/", "/****************/"],
    ["<!-- e2e -->", "<!-- ######## e2e -->"],
  ];

  await executeOptionalQuestion({
    question: "> Do you want to remove openTelemetry files? (y/N) ",
    answer,
    isSkipQuestion,
    noCallback: async () => {
      //  remove just fences
      await Promise.all([
        removeWords(".gitignore", fences[0]),
        removeWords(".github/workflows/ci.yml", fences[0]),
        removeWords("README.md", fences[2]),
      ]);
    },
    yesCallback: async () => {
      const { data } = await getPackageJson();
      const deps = ["@playwright/test"];

      await Promise.all([
        removeFiles(["playwright.config.ts", "./src/instrumentation.ts"]),
        removeDirs(["e2e"]),
        removeLines([
          [".gitignore", fences[0]],
          [".github/workflows/ci.yml", fences[0]],
          ["README.md", fences[2]],
        ]),
        removeDeps(deps),
      ]);

      // avoid dead-lock
      await removeNpmScripts(["build:test", "test:e2e", "test:e2e:ui"]);
    },
  });
}
