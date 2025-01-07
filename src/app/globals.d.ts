import type { Schema } from "../../env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Schema {}
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
