import { PrismaClient } from "@prisma/client";
import type { DefaultUser } from "next-auth";

declare global {
  // biome-ignore lint: noVar
  var prisma: PrismaClient;

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;
    }
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    role: "user" | "admin";
  }

  interface Session {
    user: User;
  }
}
