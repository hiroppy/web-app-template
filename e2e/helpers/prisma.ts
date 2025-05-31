import { PrismaClient } from "../../src/app/__generated__/prisma";

export async function generatePrismaClient(url: string) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
  });

  return {
    prisma,
    async [Symbol.asyncDispose]() {
      await prisma.$disconnect();
    },
  } as const;
}
