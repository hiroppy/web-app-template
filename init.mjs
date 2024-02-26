import { spawn } from "node:child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { createInterface } from "node:readline/promises";

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
  generateMigrationFiles(),
  updatePackageJson(),
]);

// remove me
await unlink(new URL(import.meta.url).pathname);

await format();

async function removeLines(files) {
  title("removing lines");

  await Promise.all(
    files.map(async ([file, fence]) => {
      try {
        const filePath = new URL(file, import.meta.url);
        const data = await readFile(filePath, "utf8");
        const lines = data.split("\n");
        const res = [];
        let isInFence = false;

        for (const line of lines) {
          if (line.trim() === fence[0]) {
            isInFence = true;
          }
          if (!isInFence) {
            res.push(line);
          }
          if (line.trim() === fence[1]) {
            isInFence = false;
          }
        }

        await writeFile(filePath, res.join("\n"));
      } catch (error) {
        console.error(error);
      }
    }),
  );
}

async function removeFiles(files) {}

async function generateMigrationFiles() {
  title("creating migration files");

  const commands = ["pnpm dev:db:setup", "pnpm db:stop"];

  for (const command of commands) {
    const [cmd, ...args] = command.split(" ");

    await new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: "overlapped" });

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

async function updatePackageJson() {
  title("updating package.json");

  const packageJsonPath = new URL("./package.json", import.meta.url);
  const packageJson = await readFile(packageJsonPath, "utf8");
  const parsed = JSON.parse(packageJson);
  const currentDirectoryName = basename(process.cwd());

  parsed.name = currentDirectoryName;

  await writeFile(packageJsonPath, JSON.stringify(parsed, null, 2));
}

function title(title) {
  console.log("\x1b[36m%s\x1b[0m", `🎃 - ${title}`);
}
