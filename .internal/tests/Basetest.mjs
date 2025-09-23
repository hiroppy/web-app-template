import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import { readdir, readFile, rm } from "node:fs/promises";
import { join, resolve as resolvePath } from "node:path";
import { after, before, test } from "node:test";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export class BaseTest {
  outputDir;
  outputPath;

  constructor({ outputDir }) {
    this.outputDir = `internal-tests-output-${outputDir}`;
    this.outputPath = join(process.cwd(), this.outputDir);
  }

  globalHook({ noSampleCode, noDocker, noE2e, noOtel, noStripe } = {}) {
    before(
      async () => {
        await execAsync("docker compose stop");
        await new Promise((resolve, _reject) => {
          if (!process.env.IS_MAIN_BRANCH) {
            process.env.LOCAL_FROM_PATH = resolvePath(process.cwd(), "../..");
          }

          const child =
            process.env.IS_LOCAL === "false"
              ? exec("npx create-app-foundation@latest")
              : exec("DEBUG=true create-app-foundation");

          child.stdout.on("data", (data) => {
            function debug(message) {
              console.info(`[debug]: ${message}`);
            }

            debug(data);

            if (data.includes("project named?")) {
              child.stdin.write(`${this.outputDir}\n`);
            }
            if (data.includes("remove sample application code")) {
              if (noSampleCode) {
                child.stdin.write("y\n");
              } else {
                child.stdin.write("N\n");
              }
            }
            if (data.includes("remove Docker")) {
              if (noDocker) {
                child.stdin.write("y\n");
              } else {
                child.stdin.write("N\n");
              }
            }
            if (data.includes("remove e2e")) {
              if (noE2e) {
                child.stdin.write("y\n");
              } else {
                child.stdin.write("N\n");
              }
            }
            if (data.includes("remove OpenTelemetry")) {
              if (noOtel) {
                child.stdin.write("y\n");
              } else {
                child.stdin.write("N\n");
              }
            }
            if (data.includes("remove Stripe")) {
              if (noStripe) {
                child.stdin.write("y\n");
              } else {
                child.stdin.write("N\n");
              }
            }
          });

          child.stderr.on("data", (data) => {
            console.log("stderr:", data);
          });

          child.on("close", () => {
            resolve();
          });
        });
      },
      {
        timeout: 100000,
      },
    );

    after(
      async () => {
        await execAsync(
          `
          cd ${this.outputPath} &&
          docker compose stop &&
          docker compose down --volumes
        `.trim(),
        );
        await rm(this.outputPath, { recursive: true });
      },
      {
        timeout: 100000,
      },
    );
  }

  async testFileList({ ignoreE2e = true, ignoreSrc = true } = {}) {
    test("should put files", async (t) => {
      const list = await readdir(this.outputDir, {
        recursive: true,
        withFileTypes: true,
      });

      // don't list up them
      t.assert.equal(
        list.some((dirent) =>
          dirent.parentPath.startsWith(`${this.outputDir}/node_modules`),
        ),
        true,
      );
      t.assert.equal(
        list.some((dirent) =>
          dirent.parentPath.startsWith(`${this.outputDir}/src`),
        ),
        true,
      );
      if (!ignoreE2e) {
        t.assert.equal(
          list.some((dirent) =>
            dirent.parentPath.startsWith(`${this.outputDir}/e2e`),
          ),
          true,
        );
      }

      const files = list
        .filter((dirent) => {
          if (dirent.isFile()) {
            if (
              ignoreE2e &&
              dirent.parentPath.startsWith(`${this.outputDir}/e2e`)
            ) {
              return false;
            }
            if (
              ignoreSrc &&
              dirent.parentPath.startsWith(`${this.outputDir}/src`)
            ) {
              return false;
            }
            if (
              dirent.parentPath.startsWith(`${this.outputDir}/node_modules`)
            ) {
              return false;
            }
            if (
              dirent.parentPath.startsWith(
                `${this.outputDir}/src/app/__generated__`,
              )
            ) {
              return false;
            }
            if (
              dirent.parentPath.startsWith(`${this.outputDir}/.git`) &&
              !dirent.parentPath.startsWith(`${this.outputDir}/.github`)
            ) {
              return false;
            }

            return true;
          }

          return false;
        })
        .map(({ parentPath, name }) => join(parentPath, name))
        // dynamic
        .map((file) => {
          // e.g. 'internal-tests-output/prisma/migrations/20241231003842_initial_migration/migration.sql'
          if (
            file.includes("_init/migration.sql") ||
            file.includes("_initial_migration/migration.sql")
          ) {
            return "mocked/migration.sql";
          }

          return file;
        })
        .sort();

      t.assert.snapshot(files);
    });
  }

  async testFileContent(filePaths) {
    for (const filePath of filePaths) {
      test(`should update ${filePath}`, async (t) => {
        const content = await this.getFileContent(filePath);

        t.assert.snapshot(content.split("\n"));
      });
    }
  }

  async testRemovedDirs(dirPaths) {
    test("should remove directories", async (t) => {
      const isAllDeleted = dirPaths.every((path) => {
        const target = join(this.outputPath, path);

        return !existsSync(target);
      });

      t.assert.equal(isAllDeleted, true);
    });
  }

  async testRemovedFiles(filePaths) {
    test("should remove files", async (t) => {
      const isAllDeleted = filePaths.every((path) => {
        const target = join(this.outputPath, path);

        return !existsSync(target);
      });

      t.assert.equal(isAllDeleted, true);
    });
  }

  async testDependencies() {
    test("should update dependencies", async (t) => {
      const { dependencies, devDependencies } = await this.getPackageJson();

      t.assert.snapshot({
        dependencies: Object.keys(dependencies),
        devDependencies: Object.keys(devDependencies),
      });
    });
  }

  async testNpmScripts() {
    test("should update npm scripts", async (t) => {
      const { scripts } = await this.getPackageJson();

      t.assert.snapshot(Object.keys(scripts));
    });
  }

  async testLint() {
    test("should test lint", async (t) => {
      await execAsync("npm run lint", {
        cwd: this.outputPath,
      });

      t.assert.ok(true);
    });
  }

  async testBuild() {
    test("should build", async (t) => {
      await execAsync("docker compose down", {
        cwd: this.outputPath,
      });

      await execAsync("pnpm db:up && pnpm db:deploy", {
        cwd: this.outputPath,
      });

      await execAsync("pnpm build", {
        cwd: this.outputPath,
      });

      t.assert.ok(true);
    });
  }

  async testUnit() {
    test("should test unit", async (t) => {
      await execAsync("npm run test", {
        cwd: this.outputPath,
      });

      t.assert.ok(true);
    });
  }

  async testE2e() {
    test("should test e2e", async (t) => {
      await execAsync("npm run test:e2e", {
        cwd: this.outputPath,
      });

      t.assert.ok(true);
    });
  }

  async allTests({ hasE2e }) {
    if (process.env.SKIP_TESTS === "true") {
      return;
    }

    await this.testBuild();

    await Promise.all([this.testLint(), this.testUnit()]);

    if (hasE2e) {
      await this.testE2e(hasE2e);
    }
  }

  async getFileContent(filePath) {
    return await readFile(join(this.outputPath, filePath), "utf-8");
  }

  async getPackageJson() {
    const content = await readFile(
      join(this.outputPath, "package.json"),
      "utf-8",
    );

    return JSON.parse(content);
  }
}
