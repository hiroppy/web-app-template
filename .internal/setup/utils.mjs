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
  codeAndFenceList = [],
}) {
  async function removeCodeOrFence(answer) {
    return Promise.all(
      codeAndFenceList?.map(async ([file, fence]) => {
        const fences = Array.isArray(fence[0]) ? fence : [fence];

        for (const fence of fences) {
          try {
            if (!answer) {
              await removeWords(file, fence);
            } else {
              await removeLines([[file, fence]]);
            }
          } catch {
            // ignore
          }
        }
      }),
    );
  }

  if (answer) {
    await yesCallback?.();
    await removeCodeOrFence(true);

    return;
  }

  if (!isSkipQuestion) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const answer = await rl.question(question);

    if (answer === "y" || answer === "Y") {
      await yesCallback?.();
      await removeCodeOrFence(true);
      rl.close();

      return;
    }

    rl.close();
  }

  await noCallback?.();
  await removeCodeOrFence(false);
}

export async function removeDirs(dirs) {
  try {
    await Promise.all(
      dirs.map((dir) => rm(join(basePath, dir), { recursive: true })),
    );
  } catch {}
}

export async function removeFiles(files) {
  try {
    await Promise.all(files.map((file) => unlink(join(basePath, file))));
  } catch {}
}

export async function removeWords(file, words) {
  const data = await readFileFromCopiedDir(file);
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

  await writeFileToCopiedDir(file, res.join("\n"));
}

export async function removeLines(files) {
  await Promise.all(
    files.map(async ([file, fence]) => {
      try {
        const data = await readFileFromCopiedDir(file);
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

        await writeFileToCopiedDir(file, res.join("\n"));
      } catch {
        // ignore
      }
    }),
  );
}

export async function getPackageJson() {
  const packageJson = await readFileFromCopiedDir("package.json");
  const parsed = JSON.parse(packageJson);

  return { path: join(basePath, "package.json"), data: parsed };
}

export async function removeDeps(deps) {
  await execAsync(`pnpm remove ${deps.join(" ")}`, { stdio: "ignore" });
}

export async function removeNpmScripts(scripts) {
  const { path, data } = await getPackageJson();

  for (const script of scripts) {
    delete data.scripts[script];
  }

  await writeFile(path, JSON.stringify(data, null, 2));
}

export async function readFileFromCopiedDir(file) {
  const target = join(basePath, file);
  const data = await readFile(target, "utf8");

  return data;
}

export async function writeFileToCopiedDir(file, data) {
  const target = join(basePath, file);

  await writeFile(target, data);
}

export async function removeItemModelFromPrisma(fileName, modelName) {
  const prismaPath = join("prisma", "schema", `${fileName}.prisma`);

  const data = await readFileFromCopiedDir(prismaPath);

  // 1. モデルブロック（model Foo { ... }）を丸ごと削除
  //    - [\s\S]*? で改行込みですべてマッチ
  //    - ブロック直後の余計な空白や改行は \s*\n? などで最小限だけ削除
  const modelRegex = new RegExp(
    `model\\s+${modelName}\\s+\\{[\\s\\S]*?\\}\\s*\\n?`,
    "gm",
  );
  let updatedSchema = data.replace(modelRegex, "");

  // 2. モデル参照（Foo[]など）を行単位で削除
  //    - マルチラインフラグ m を使って ^ と $ を行頭・行末に対応
  //    - これで該当行をまるごと消せば、途中で行が潰れるのを防げる
  const fieldRegex = new RegExp(`^\\s*\\w+\\s+${modelName}\\[\\].*?\\n?`, "gm");
  updatedSchema = updatedSchema.replace(fieldRegex, "");

  // 3. @@系やコメント位置の整形
  updatedSchema = updatedSchema.replace(
    /([^\n])(\s*@@\w+\s*\(.*?\))/g,
    "$1\n$2",
  );
  updatedSchema = updatedSchema.replace(/([^\n])(\s*@@\w+)/g, "$1\n$2");
  updatedSchema = updatedSchema.replace(/(\w)\s+(\/\/)/g, "$1\n$2");

  await writeFileToCopiedDir(prismaPath, updatedSchema);
}
