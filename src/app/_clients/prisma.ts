// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from "@prisma/client";
import { createDBUrl } from "../_utils/db";

function prismaClientSingleton() {
  return new PrismaClient({
    datasources: {
      db: {
        url: createDBUrl({}),
      },
    },
  });
}

// biome-ignore lint: Do not shadow the global "globalThis" property.
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
