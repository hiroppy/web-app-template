import { executeOptionalQuestion, removeFiles } from "../utils.mjs";

export const removedFiles = /** @type {const} */ (["Dockerfile"]);

export const removedDirs = /** @type {const} */ ([]);

export const modifiedFiles = /** @type {const} */ ([
  ".github/workflows/ci.yml",
]);

export async function docker(answer, isSkipQuestion) {
  const fence = ["# start: docker #", "# end: docker #"];

  await executeOptionalQuestion({
    question: "> Do you want to remove docker files? (y/N) ",
    answer,
    isSkipQuestion,
    codeAndFenceList: [[modifiedFiles[0], fence]],
    yesCallback: async () => {
      await Promise.all([removeFiles(removedFiles)]);
    },
  });
}
