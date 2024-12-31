import { exec } from "node:child_process";
import { readFile, readdir, rm } from "node:fs/promises";
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

  globalHook({ noDocker }) {
    before(
      async () => {
        await execAsync("docker compose stop");
        await new Promise((resolve, reject) => {
          if (!process.env.IS_MAIN_BRANCH) {
            process.env.LOCAL_FROM_PATH = resolvePath(process.cwd(), "../..");
          }

          // for local debug
          // const child = exec("create-app-foundation");
          const child = exec("npx create-app-foundation@latest");

          child.stdout.on("data", (data) => {
            function debug(message) {
              console.info(`[debug]: ${message}`);
            }

            debug(data);

            if (data.includes("project named?")) {
              child.stdin.write(`${this.outputDir}\n`);
            }
            if (data.includes("remove Docker")) {
              if (noDocker) {
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

  async testFileList() {
    test("should put files", async (t) => {
      const list = await readdir(this.outputDir, {
        recursive: true,
        withFileTypes: true,
      });

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
      t.assert.equal(
        list.some((dirent) =>
          dirent.parentPath.startsWith(`${this.outputDir}/e2e`),
        ),
        true,
      );

      const files = list
        .filter(
          (dirent) =>
            dirent.isFile() &&
            !dirent.parentPath.startsWith(`${this.outputDir}/node_modules`) &&
            !dirent.parentPath.startsWith(`${this.outputDir}/src`) &&
            !dirent.parentPath.startsWith(`${this.outputDir}/e2e`),
        )
        .map(({ parentPath, name }) => join(parentPath, name))
        // dynamic
        .map((file) => {
          // e.g. 'internal-tests-output/prisma/migrations/20241231003842_initial_migration/migration.sql'
          if (file.includes("_initial_migration/migration.sql")) {
            return "mocked/migration.sql";
          }

          return file;
        })
        .sort();

      t.assert.snapshot(files);
    });
  }

  async testFileContent(filePath) {
    test(`should update ${filePath}`, async (t) => {
      const content = await this.getFileContent(filePath);

      t.assert.snapshot(content.split("\n"));
    });
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
