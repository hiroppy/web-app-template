import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeWords,
} from "../utils.mjs";

export const removedFiles = /** @type {const} */ ([
  "otel-collector-config.yml",
  "./src/instrumentation.ts",
]);

export const removedDirs = /** @type {const} */ (["./src/otel"]);

export const modifiedFiles = /** @type {const} */ ([
  "compose.yml",
  "next.config.ts",
  "README.md",
  "env.ts",
  "Dockerfile",
  ".env.sample",
  ".env.test",
  ".github/workflows/ci.yml",
]);

export async function otel(answer, isSkipQuestion) {
  const fences = [
    ["# start: otel #", "# end: otel #"],
    ["/* start: otel */", "/* end: otel */"],
    ["<!-- start: otel -->", "<!-- end: otel -->"],
  ];

  await executeOptionalQuestion({
    question: "> Do you want to remove openTelemetry files? (y/N) ",
    answer,
    isSkipQuestion,
    codeAndFenceList: [
      [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[1]],
      [modifiedFiles[2], fences[2]],
      [modifiedFiles[3], fences[1]],
      [modifiedFiles[4], fences[0]],
      [modifiedFiles[5], fences[0]],
      [modifiedFiles[6], fences[0]],
      [modifiedFiles[7], fences[0]],
    ],
    yesCallback: async () => {
      const { data } = await getPackageJson();
      const deps = [
        "@prisma/instrumentation",
        ...Object.keys(data.dependencies).filter((key) =>
          key.startsWith("@opentelemetry/"),
        ),
      ];

      await Promise.all([
        removeFiles(removedFiles),
        removeDirs(removedDirs),
        removeDeps(deps),
        removeWords(modifiedFiles[7], [
          "--build-arg TRACE_EXPORTER_URL=$" +
            "{{env.TRACE_EXPORTER_URL}} \\\\",
        ]),
      ]);
    },
  });
}
