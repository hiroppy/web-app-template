import { prisma } from "@/app/_clients/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/signin",
  },
  // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ?? "user",
        };
      },
    }),
  ],
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: async ({ session, token, user, trigger, newSession }) => {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }

      return session;
    },
  },
};
