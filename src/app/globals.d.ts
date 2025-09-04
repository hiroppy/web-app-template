// issue: https://github.com/nextauthjs/next-auth/issues/9571
import "next-auth/jwt";
import type { ZodFlattenedError } from "zod";
import type { Schema } from "../../env";
import type { Role } from "./__generated__/prisma";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Schema {}
  }

  type PartialWithNullable<T> = {
    [P in keyof T]?: T[P] | null;
  };

  type SuccessResult<T> = {
    success: true;
    data: T;
    message?: string;
  };

  type FailureResult<T, U> = {
    success: false;
    message?: string;
    data?: U;
    zodErrors?: T extends Record<string, unknown>
      ? ZodFlattenedError<T>["fieldErrors"]
      : never;
  };

  /**
   * @typeParam T - data to be returned if successful
   * @typeParam U - validation error by zod
   * @typeParam P - data to be returned if failed
   */
  type Result<T = void, U = Record<string, unknown>, P = never> =
    | SuccessResult<T>
    | FailureResult<U, P>;
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
