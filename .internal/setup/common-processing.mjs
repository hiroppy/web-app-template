import { generateMigrationFiles } from "./db.mjs";
import { updatePackageJson } from "./package-json.mjs";
import { removeFiles, removeLines, title } from "./utils.mjs";

export const removedFiles = /** @type {const} */ ([
  "LICENSE",
  ".github/workflows/site.yml",
  ".github/workflows/internal.yml",
  ".github/workflows/claude-code-review.yml",
  ".github/workflows/update-internal-e2e.yml",
  ".github/workflows/claude.yml",
]);

export const removedDirs = /** @type {const} */ ([]);

export const modifiedFiles = /** @type {const} */ ([
  ".gitignore",
  ".github/workflows/ci.yml",
  "README.md",
  "knip.config.ts",
]);

export async function executeCommonProcessing() {
  const fences = [
    ["####### 👉 remove #######", "########################"],
    ["<!-- 👉 remove -->", "<!-- ######## -->"],
    ["// 👉 remove", "///////////"],
  ];

  await Promise.all([
    removeLines([
      [modifiedFiles[0], fences[0]],
      [modifiedFiles[1], fences[0]],
      [modifiedFiles[2], fences[1]],
      [modifiedFiles[3], fences[2]],
    ]),
    (async () => {
      title("Updating package.json");
      await updatePackageJson();
    })(),
    (async () => {
      title("Creating migration files");
      await generateMigrationFiles();
    })(),
    await removeFiles(removedFiles),
  ]);
}
