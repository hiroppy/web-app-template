// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

import { PrismaClient } from "@prisma/client";

export let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-expect-error avoid declaring global.prisma at global.d.ts to enable auto import by editors
  if (!global.prisma) {
    // @ts-expect-error ditto
    global.prisma = new PrismaClient();
  }

  // @ts-expect-error ditto
  prisma = global.prisma;
}
