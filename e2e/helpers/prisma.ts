import { PrismaClient } from "../../src/app/__generated__/prisma";

export async function generatePrismaClient() {
  const prisma = new PrismaClient();

  return {
    prisma,
    async [Symbol.asyncDispose]() {
      await prisma.$disconnect();
    },
  } as const;
}
