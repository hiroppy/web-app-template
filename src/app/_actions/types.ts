import type { typeToFlattenedError } from "zod";

type SuccessResult<T, U> = {
  success: true;
  data: T;
  message?: string;
};

type FailureResult<T, U> = {
  success: false;
  data?: T;
  message?: string;
  zodErrors?: typeToFlattenedError<U>["fieldErrors"];
};

export type Result<T = void, U = Record<string, unknown>> =
  | SuccessResult<T, U>
  | FailureResult<T, U>;
