import { exec } from "node:child_process";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";
import { DockerComposeEnvironment, Wait } from "testcontainers";

const execAsync = promisify(exec);

export async function setupDB() {
  const container = await new DockerComposeEnvironment(".", "compose.yml")
    .withEnvironmentFile(".env.test")
    .withWaitStrategy("db", Wait.forListeningPorts())
    .up(["db"]);
  const dbContainer = container.getContainer("db-1");
  const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${dbContainer.getHost()}:${dbContainer.getMappedPort(5432)}/${process.env.POSTGRES_DB}?schema=public`;

  await execAsync(`DATABASE_URL=${dbUrl} npx prisma migrate dev`);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  return <const>{
    container,
    prisma,
    async [Symbol.asyncDispose]() {
      await container.down();
    },
  };
}
