import {
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
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
      ["compose.yml", fences[0]],
      ["next.config.ts", fences[1]],
      ["README.md", fences[2]],
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
      ]);
    },
  });
}
