import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeLines,
  removeWords,
} from "./utils.mjs";

export async function otel(answer, isSkipQuestion) {
  const fences = [
    ["####### otel #######", "########################"],
    ["/***** otel *****/", "/****************/"],
    ["<!-- otel -->", "<!-- ######## otel -->"],
  ];

  await executeOptionalQuestion({
    question: "> Do you want to remove openTelemetry files? (y/N) ",
    answer,
    isSkipQuestion,
    noCallback: async () => {
      //  remove just fences
      await Promise.all([
        removeWords("compose.yml", fences[0]),
        removeWords("next.config.ts", fences[1]),
        removeWords("README.md", fences[2]),
      ]);
    },
    yesCallback: async () => {
      const { data } = await getPackageJson();
      const deps = [
        "@prisma/instrumentation",
        ...Object.keys(data.dependencies).filter((key) =>
          key.startsWith("@opentelemetry/"),
        ),
      ];

      await Promise.all([
        removeFiles(["otel-collector-config.yml", "./src/instrumentation.ts"]),
        removeDirs(["./src/otel"]),
        removeLines([
          ["compose.yml", fences[0]],
          ["next.config.ts", fences[1]],
          ["README.md", fences[2]],
        ]),
        removeDeps(deps),
      ]);
    },
  });
}
