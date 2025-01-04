import {
  executeOptionalQuestion,
  removeFiles,
  removeLines,
  removeWords,
} from "./utils.mjs";

export async function docker(answer, isSkipQuestion) {
  const fence = ["####### docker #######", "########################"];

  await executeOptionalQuestion({
    question: "> Do you want to remove docker files? (y/N) ",
    answer,
    isSkipQuestion,
    noCallback: async () => {
      // remove just fences
      await removeWords(".github/workflows/ci.yml", fence);
    },
    yesCallback: async () => {
      await Promise.all([
        removeFiles(["Dockerfile"]),
        removeLines([[".github/workflows/ci.yml", fence]]),
      ]);
    },
  });
}
