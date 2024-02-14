import { prisma } from "@/app/_clients/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "database",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: async ({ session, token, user, trigger, newSession }) => {
      if (session?.user) {
        session.user.id = user.id;
      }

      return {
        ...session,
        user: {
          ...session.user,
        },
      };
    },
  },
};
