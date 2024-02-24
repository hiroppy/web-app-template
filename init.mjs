import { spawn } from "node:child_process";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { basename } from "node:path";

await Promise.all([removeLines(), commands(), updatePackageJson()]);
await unlink(new URL(import.meta.url).pathname);

await updatePackageJson();

async function removeLines() {
  async function removeLinesFromFile(filePath, fence) {
    console.log(`removing lines from: ${filePath}`);

    try {
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
  }

  const fences = [
    ["####### 👉 remove #######", "########################"],
    ["<!-- 👉 remove -->", "<!-- ######## -->"],
  ];
  const files = [
    [".gitignore", fences[0]],
    [".github/workflows/ci.yml", fences[0]],
    ["README.md", fences[1]],
  ];

  await Promise.all(
    files.map(async ([file, fence]) => await removeLinesFromFile(file, fence)),
  );
}

async function commands() {
  const commands = ["pnpm dev:db:setup", "pnpm fmt", "pnpm db:stop"];

  for (const command of commands) {
    console.log(`running: ${command}`);

    const [cmd, ...args] = command.split(" ");

    await new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: "inherit" });

      child.stdout?.on("data", (data) => {
        console.log(data);
      });

      child.stderr?.on("data", (data) => {
        console.log(data);
      });

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
  const packageJsonPath = new URL("./package.json", import.meta.url);
  const packageJson = await readFile(packageJsonPath, "utf8");
  const parsed = JSON.parse(packageJson);
  const currentDirectoryName = basename(process.cwd());

  parsed.name = currentDirectoryName;

  await writeFile(packageJsonPath, JSON.stringify(parsed, null, 2));
}
