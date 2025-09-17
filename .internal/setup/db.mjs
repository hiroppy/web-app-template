import { spawn } from "node:child_process";

export async function generateMigrationFiles() {
  const commands = [
    "pnpm db:up",
    "pnpm db:migrate --name initial",
    "pnpm generate:client",
    "docker compose down",
  ];

  for (const command of commands) {
    const [cmd, ...args] = command.split(" ");

    await new Promise((resolve, reject) => {
      const child = spawn(cmd, args, { stdio: "ignore" });

      child.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `[docker compose]: "${command}" failed with code ${code}`,
            ),
          );
        }
      });
    });
  }
}
