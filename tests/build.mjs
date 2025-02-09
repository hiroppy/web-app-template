import { exec } from "node:child_process";
import { promisify } from "node:util";
import nextEnv from "@next/env";
import { Prisma, PrismaClient } from "@prisma/client";
import { DockerComposeEnvironment, Wait } from "testcontainers";

process.env.NODE_ENV = "test";

const { loadEnvConfig } = nextEnv;
const execAsync = promisify(exec);

loadEnvConfig(process.cwd());

const container = await new DockerComposeEnvironment(".", "compose.yml")
  .withEnvironmentFile(".env.test")
  .withEnvironment({
    DATABASE_PORT: process.env.DATABASE_PORT,
  })
  .withWaitStrategy("db", Wait.forListeningPorts())
  .up(["db"]);
const dbContainer = container.getContainer("db-1");
const mappedPort = dbContainer.getMappedPort(5432);
const url = `postgresql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${dbContainer.getHost()}:${mappedPort}/${process.env.DATABASE_DB}?schema=${process.env.DATABASE_SCHEMA}`;

{
  const { stdout } = await execAsync(`DATABASE_URL=${url} npx prisma db push`);

  console.log(stdout);
}
{
  const { stdout } = await execAsync("pnpm build");

  console.log(stdout);
}

await container.down();
