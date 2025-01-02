export type {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // public
      NEXT_PUBLIC_SITE_URL: string;

      // private
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
      POSTGRES_DB: string;
      POSTGRES_SCHEMA: string;

      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      TRACE_EXPORTER_URL?: string;

      NEXTAUTH_TEST_MODE?: string;
    }
  }

  type PartialWithNullable<T> = {
    [P in keyof T]?: T[P] | null;
  };
}

declare module "next-auth" {
  interface User {
    id: string;
    role: "user" | "admin";
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
