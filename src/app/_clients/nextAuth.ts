import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";
import { config, configForTest } from "./nextAuthConfig";
import { prisma } from "./prisma";

export const { auth, handlers } = NextAuth({
  // https://authjs.dev/getting-started/migrating-to-v5#edge-compatibility
  ...config,
  adapter: <Adapter>PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    ...config.callbacks,
    jwt: async ({
      token,
      /* user exists when only signing in */ user,
      trigger,
    }): Promise<JWT> => {
      const userId = token.sub ?? user?.id;

      if (!userId) {
        throw new Error("Token is invalid");
      }

      // support for multiple devices
      const me = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      // to avoid accessing devices having invalid JWT if user is not found
      if (trigger !== "signUp" && !user && !me) {
        throw new Error("User not found");
      }

      // in favor of the user's latest data and update the token
      token.user = {
        id: userId,
        name: me?.name ?? token.name,
        email: me?.email ?? token.email,
        role: me?.role ?? user.role,
        image: me?.image ?? token.picture,
      };

      return token;
    },
  },
  ...(process.env.NEXTAUTH_TEST_MODE === "true" ? configForTest : {}),
});
