import { PrismaClient } from "@prisma/client";

export async function generatePrismaClient() {
  const prisma = new PrismaClient();

  return {
    prisma,
    async [Symbol.asyncDispose]() {
      await prisma.$disconnect();
    },
  };
}
