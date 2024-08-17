import { prisma } from "@/app/_clients/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  // @ts-expect-error https://github.com/nextauthjs/next-auth/issues/9493
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google requires "offline" access_type to provide a `refresh_token`
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
        },
      },
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
    redirect: async ({ baseUrl }) => {
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      // First login
      if (account) {
        return {
          ...token,
          user,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
        } as JWT;
      }

      if (Date.now() < token.expiresAt * 1000) {
        return token;
      }

      if (!token.refreshToken) {
        throw new Error("invalid refresh_token");
      }

      try {
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          }),
        }).then((res) => res.json());

        return {
          ...token,
          accessToken: res.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + res.expires_in),
          refreshToken: res.refresh_token ?? token.refreshToken,
        };
      } catch (e) {
        return <const>{
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    session: async ({ session, token }) => {
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
  },
};
