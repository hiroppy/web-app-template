// don't depend on any external node_modules packages

import { generateMigrationFiles } from "./db.mjs";
import { docker } from "./docker.mjs";
import { format } from "./format.mjs";
import { otel } from "./otel.mjs";
import { updatePackageJson } from "./packageJson.mjs";
import {
  basePath,
  execAsync,
  executeOptionalQuestion,
  getPackageJson,
  removeDeps,
  removeDirs,
  removeFiles,
  removeLines,
  removeWords,
  title,
} from "./utils.mjs";

const [_, __, ...flags] = process.argv;
const isSkipQuestions = flags.includes("--skip-questions");
const isRemoveDocker = flags.includes("--remove-docker");
const isRemoveOtel = flags.includes("--remove-otel");

await execAsync("npm run setup", { stdio: "ignore" });

title("Installing dependencies");
await execAsync("pnpm i", { stdio: "ignore" });

title("Copying .env.sample to .env");
await execAsync("cp .env.sample .env");

{
  // common
  const fences = [
    ["####### 👉 remove #######", "########################"],
    ["<!-- 👉 remove -->", "<!-- ######## -->"],
  ];

  await Promise.all([
    removeLines([
      [".gitignore", fences[0]],
      [".github/workflows/ci.yml", fences[0]],
      ["README.md", fences[1]],
    ]),
    (async () => {
      title("Updating package.json");
      await updatePackageJson();
    })(),
    (async () => {
      title("Creating migration files");
      await generateMigrationFiles();
    })(),
    removeDirs([".github/assets"]),
    removeFiles(["LICENSE"]),
  ]);
}

await docker(isRemoveDocker, isSkipQuestions);

await otel(isRemoveOtel, isSkipQuestions);

await removeDirs([".internal"]);

await format();

console.info("done! please commit them 🐶");
