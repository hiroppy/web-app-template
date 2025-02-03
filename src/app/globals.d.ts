// issue: https://github.com/nextauthjs/next-auth/issues/9571
import "next-auth/jwt";
import type { Role } from "@prisma/client";
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
    name: string;
    email: string;
    image: string;
    role: Role;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: import("next-auth").Session["user"];
  }
}
