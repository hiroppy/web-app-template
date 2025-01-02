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
  ...config,
  // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...config.callbacks,
    jwt: async ({ token, user, trigger }) => {
      // user exists when only signing in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // support for multiple devices
      const me = await prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
      });

      // to avoid accessing devices having invalid JWT if user is not found
      if (trigger !== "signUp" && !user && !me) {
        throw new Error("User not found");
      }

      // in favor of the user's latest data and update the token
      if (me) {
        token.name = me.name;
        token.image = me.image;
        token.email = me.email;
        token.role = me.role;
      }

      return token;
    },
  },
  ...(process.env.NEXTAUTH_TEST_MODE === "true" ? configForTest : {}),
});
