import { spawn } from "node:child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { createInterface } from "node:readline/promises";

const [_, __, ...flags] = process.argv;
const isSkipQuestions = flags.includes("--skip-questions");
const isRemoveDocker = flags.includes("--remove-docker");
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

await docker();

await removeFiles(["init.mjs", ".github/assets/jaeger.png"]);

await format();

console.log("done! please commit them 🐶");

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

async function removeWords(file, words) {
  const filePath = new URL(file, import.meta.url);
  const data = await readFile(filePath, "utf8");
  const lines = data.split("\n");
  const res = [];

  for (const line of lines) {
    let str = line;

    // keep already empty lines
    if (str.trim() === "") {
      res.push(str);
      continue;
    }

    for (const word of words) {
      if (line.includes(word)) {
        str = str.replace(word, "");
      }
    }

    if (str.trim() !== "") {
      res.push(str);
    }
  }

  await writeFile(filePath, res.join("\n"));
}

async function removeFiles(files) {
  await Promise.all(
    files.map((file) => unlink(new URL(file, import.meta.url))),
  );
}

async function generateMigrationFiles() {
  title("creating migration files");

  const commands = [
    "pnpm db:start",
    "pnpm dev:db:migrate --name initial-migration",
    "pnpm dev:db:generate",
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

function title(title) {
  console.log("\x1b[36m%s\x1b[0m", `🎃 - ${title}`);
}
