import "next-auth";
import "next-auth/jwt";
import type { DefaultUser } from "next-auth";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      TRACE_EXPORTER_URL: string | /* for local */ undefined;
    }
  }
}

interface UserInfo extends DefaultUser {
  id: string;
  role: "user" | "admin";
}

interface TokenError {
  error?: "RefreshAccessTokenError";
}

declare module "next-auth" {
  interface User extends UserInfo {}

  interface Session extends TokenError {
    user: UserInfo;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends TokenError {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
    user: UserInfo;
  }
}
