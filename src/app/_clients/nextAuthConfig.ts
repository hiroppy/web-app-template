// don't import @auth/prisma-adapter here to avoid importing it at Edge

import type { NextAuthConfig, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    redirect: async ({ baseUrl }) => {
      return baseUrl;
    },
    async jwt({ token, user }) {
      // user exists when only signing in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as User["role"];
      }

      return session;
    },
  },
  // https://authjs.dev/getting-started/deployment#docker
  trustHost: true,
} satisfies NextAuthConfig;

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
