// https://github.com/vercel/next.js/blob/canary/packages/create-next-app/helpers/git.ts

import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

function isInGitRepository() {
  try {
    execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
    return true;
  } catch (_) {}
  return false;
}

function isInMercurialRepository() {
  try {
    execSync("hg --cwd . root", { stdio: "ignore" });
    return true;
  } catch (_) {}
  return false;
}

export function tryGitInit(root) {
  let didInit = false;

  try {
    execSync("git --version", { stdio: "ignore" });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync("git init", { stdio: "ignore" });
    didInit = true;

    return true;
  } catch (e) {
    console.log(e);
    if (didInit) {
      try {
        removeGit(root);
      } catch (_) {}
    }
    return false;
  }
}

export function removeGit(root) {
  rmSync(join(root, ".git"), { recursive: true, force: true });
}

export function cloneRepo() {
  const url = "https://github.com/hiroppy/web-app-template.git";

  execSync(`git clone ${url} .`, { stdio: "ignore" });
}
