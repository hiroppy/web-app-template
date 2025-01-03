#!/usr/bin/env node

import { execSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readdir, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { cloneRepo, removeGit, tryGitInit } from "./git.mjs";

try {
  await Promise.all([isPortTaken(5432), isPortTaken(5433)]);
} catch (e) {
  console.log(e.message);
  process.exit(1);
}

const rl = createInterface({ input, output });

let workingDir = "";
const args = [];

{
  const answer = await rl.question(question("What is your project named?"));

  workingDir = join(process.cwd(), answer);

  try {
    await mkdir(workingDir);
  } catch {
    error("The directory already exists");
    process.exit(1);
  }
}
{
  const answer = await rl.question(
    question("Do you want to remove Docker for app? (y/N)"),
  );

  if (answer === "y" || answer === "Y") {
    args.push("--remove-docker");
  }
}
{
  const answer = await rl.question(
    question("Do you want to remove OpenTelemetry for app? (y/N)"),
  );

  if (answer === "y" || answer === "Y") {
    args.push("--remove-otel");
  }
}

rl.close();

process.chdir(workingDir);

if (process.env.LOCAL_FROM_PATH) {
  await copyDir(process.env.LOCAL_FROM_PATH, workingDir);
} else {
  cloneRepo();
  report("Completed to clone hiroppy/web-app-template");
}

removeGit(workingDir);
tryGitInit(workingDir);

report("Setting up...");
args.push("--skip-questions");
execSync(`node .internal/init.mjs ${args.join(" ")}`, { stdio: "inherit" });

console.log("");
console.log("Completed to setup 🎉🎉🎉🎉🎉🎉");
console.log("");
console.log(
  "🖼️  this code base is https://github.com/hiroppy/web-app-template.",
);

function question(title) {
  return `🎃 ${title}  `;
}

function report(text) {
  console.log("\x1b[36m%s\x1b[0m", `🐕  ${text}`);
}

function error(text) {
  console.error("\x1b[31m%s\x1b[0m", `🔥  ${text}`);
}

async function isPortTaken(port) {
  return new Promise((resolve, reject) => {
    const tester = createServer()
      .once("error", (err) => {
        reject(err);
      })
      .once("listening", () => {
        tester.once("close", () => resolve(true)).close();
      })
      .listen(port);
  });
}

async function copyDir(from, to) {
  console.log(`copy from ${process.env.LOCAL_FROM_PATH}`);
  console.log(`copy to ${to}`);

  const tmpDir = join(tmpdir(), "create-app-foundation-");

  console.log(`tmpDir: ${tmpDir}`);

  await copyDirectory(from, tmpDir, [
    // add files written in .gitignore
    /node_modules/,
    /\.DS_Store$/,
    /\.next$/,
    /test-results/,
    /\.env$/,
    /next-env\.d\.ts$/,
    /prisma\/migrations/,
  ]);
  await cp(tmpDir, to, { recursive: true });
  await rm(tmpDir, { recursive: true });
}

async function copyDirectory(src, dest, exclude = []) {
  await mkdir(dest, { recursive: true });

  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (exclude.some((pattern) => pattern.test(srcPath))) {
      console.log(`Excluding: ${srcPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath, exclude);
    } else {
      await cp(srcPath, destPath);
    }
  }
}
