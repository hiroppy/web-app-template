import { spawn } from "node:child_process";
import { readFile, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import {
  getPackageJson,
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
const fences = [
  ["####### 👉 remove #######", "########################"],
  ["<!-- 👉 remove -->", "<!-- ######## -->"],
];
const basePath = resolve(import.meta.dirname, "..");

await Promise.all([
  removeLines([
    [".gitignore", fences[0]],
    [".github/workflows/ci.yml", fences[0]],
    ["README.md", fences[1]],
  ]),
  generateMigrationFiles(),
  updatePackageJson(),
  removeDirs([".github/assets"]),
  removeFiles(["LICENSE"]),
]);

await docker();

await otel();

await removeDirs([".internal"]);

await format();

console.log("done! please commit them 🐶");

async function format() {
  title("formatting");

  await new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["fmt"], { stdio: "overlapped" });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`command failed with code ${code}`));
      }
    });
  });
}

async function generateMigrationFiles() {
  title("creating migration files");

  const commands = [
    "pnpm db:up",
    "pnpm db:migrate --name initial-migration",
    "pnpm generate:client",
    "pnpm db:stop",
  ];

  for (const command of commands) {
    const [cmd, ...args] = command.split(" ");

    await new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: "inherit" });

      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`command failed with code ${code}`));
        }
      });
    });
  }
}

async function updatePackageJson() {
  title("updating package.json");

  const { path, data } = await getPackageJson();
  const currentDirectoryName = basename(process.cwd());

  data.name = currentDirectoryName;
  data.version = "0.0.1";

  await writeFile(path, JSON.stringify(data, null, 2));
}

async function docker() {
  const fence = ["####### docker #######", "########################"];

  title("docker");

  if (isRemoveDocker) {
    await run();

    return;
  }

  if (!isSkipQuestions) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await rl.question(
      "> Do you want to remove docker files? (y/N) ",
    );

    if (answer === "y" || answer === "Y") {
      await run();
      rl.close();

      return;
    }

    rl.close();
  }

  // no: remove just fences
  await removeWords(".github/workflows/ci.yml", fence);

  async function run() {
    await Promise.all([
      removeFiles(["Dockerfile"]),
      removeLines([[".github/workflows/ci.yml", fence]]),
    ]);
  }
}

async function otel() {
  const fence = ["####### otel #######", "########################"];

  title("openTelemetry");
}
