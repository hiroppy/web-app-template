// don't import prisma or @auth/prisma-adapter here to avoid importing it at Edge
// [auth][error] JWTSessionError: Read more at https://errors.authjs.dev#jwtsessionerror
// [auth][cause]: Error: PrismaClient is not configured to run in Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware). In order to run Prisma Client on edge runtime, either:

import type { NextAuthConfig, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const configForTest = {
  jwt: {
    encode: async ({ token }) => {
      return btoa(JSON.stringify(token));
    },
    decode: async ({ token }) => {
      if (!token) {
        return {};
      }

      return JSON.parse(atob(token));
    },
  },
} satisfies Omit<NextAuthConfig, "providers">;

export const config = {
  pages: {
    signIn: "/signin",
  },
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
          // https://authjs.dev/guides/role-based-access-control#persisting-the-role
          role: profile.role ?? "user",
        };
      },
    }),
  ],
  callbacks: {
    redirect: ({ url, baseUrl }) => {
      return baseUrl;
    },
    session: ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as User["role"];
      }

      return session;
    },
  },
  // https://authjs.dev/getting-started/deployment#docker
  trustHost: true,
  ...(process.env.NEXTAUTH_TEST_MODE === "true" ? configForTest : {}),
} satisfies NextAuthConfig;
