import { prisma } from "@/app/_clients/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { config } from "./auth";

export const { auth, handlers } = NextAuth({
  // https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
  // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...config,
});
