import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    // JWT session strategy for Edge Runtime compatibility
    expiresIn: 60 * 60, // Session expires after 1 hour
    updateAge: 60 * 15, // Session auto-refreshes every 15 minutes when used
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60, // Cache expires after 1 hour
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
      },
    },
  },
  advanced: {
    database: {
      generateId: () => {
        return crypto.randomUUID();
      },
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_SITE_URL as string],
});

export type User = typeof auth.$Infer.Session.user;
