import { exec } from "node:child_process";
import { readFile, rm, unlink, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { promisify } from "node:util";

export const basePath = resolve(import.meta.dirname, "../..");

export const execAsync = promisify(exec);

export function title(title) {
  console.info("\x1b[36m%s\x1b[0m", `🎃 ${title}...`);
}

export async function executeOptionalQuestion({
  question,
  /* for skip question*/ answer,
  isSkipQuestion,
  noCallback,
  yesCallback,
}) {
  if (answer) {
    await yesCallback();

    return;
  }

  if (!isSkipQuestion) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await rl.question(question);

    if (answer === "y" || answer === "Y") {
      await yesCallback();
      rl.close();

      return;
    }

    rl.close();
  }

  await noCallback();
}

export async function removeDirs(dirs) {
  await Promise.all(
    dirs.map((dir) => rm(join(basePath, dir), { recursive: true })),
  );
}

export async function removeFiles(files) {
  await Promise.all(files.map((file) => unlink(join(basePath, file))));
}

export async function removeWords(file, words) {
  const target = join(basePath, file);
  const data = await readFile(target, "utf8");
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

  await writeFile(target, res.join("\n"));
}

export async function removeLines(files) {
  await Promise.all(
    files.map(async ([file, fence]) => {
      try {
        const target = join(basePath, file);
        const data = await readFile(target, "utf8");
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

        await writeFile(target, res.join("\n"));
      } catch (error) {
        console.error(error);
      }
    }),
  );
}

export async function getPackageJson() {
  const packageJsonPath = join(basePath, "package.json");
  const packageJson = await readFile(packageJsonPath, "utf-8");
  const parsed = JSON.parse(packageJson);

  return { path: packageJsonPath, data: parsed };
}

export async function removeDeps(deps) {
  await execAsync(`pnpm remove ${deps.join(" ")}`, { stdio: "ignore" });
}
