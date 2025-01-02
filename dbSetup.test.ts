import { exec } from "node:child_process";
import { promisify } from "node:util";
import { Prisma, PrismaClient } from "@prisma/client";
import { DockerComposeEnvironment, Wait } from "testcontainers";

const execAsync = promisify(exec);

export async function setupDB() {
  const container = await new DockerComposeEnvironment(".", "compose.yml")
    .withEnvironmentFile(".env.test")
    .withWaitStrategy("db", Wait.forListeningPorts())
    .up(["db"]);
  const dbContainer = container.getContainer("db-1");
  const dbUrl = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${dbContainer.getHost()}:${dbContainer.getMappedPort(5432)}/${process.env.POSTGRES_DB}?schema=public`;

  await execAsync(`DATABASE_URL=${dbUrl} npx prisma migrate deploy`);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  async function truncate() {
    const tableNames = Prisma.dmmf.datamodel.models.map((model) => {
      return model.dbName || model.name.toLowerCase();
    });
    const truncateQuery = `TRUNCATE TABLE ${tableNames.map((name) => `"${name}"`).join(", ")} CASCADE`;

    await prisma.$executeRawUnsafe(truncateQuery);
  }

  async function down() {
    await prisma.$disconnect();
    await container.down();
  }

  return <const>{
    container,
    prisma,
    truncate,
    down,
    async [Symbol.asyncDispose]() {
      await down();
    },
  };
}
