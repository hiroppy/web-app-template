import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { config, configForTest } from "./nextAuthConfig";
import { prisma } from "./prisma";

export const {
  auth,
  unstable_update: update,
  handlers,
} = NextAuth({
  // https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
  // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...(process.env.NEXTAUTH_TEST_MODE === "true" ? configForTest : {}),
  ...config,
});
