import type { typeToFlattenedError } from "zod";

export type Result<T = void, U = Record<string, unknown>> = {
  success: boolean;
  message?: string;
  data?: T;
  zodErrors?: typeToFlattenedError<U>["fieldErrors"];
};
