import type { Schema } from "../../env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Schema {}
  }

  type PartialWithNullable<T> = {
    [P in keyof T]?: T[P] | null;
  };
}
