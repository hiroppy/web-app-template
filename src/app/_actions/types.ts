import type { typeToFlattenedError } from "zod";

type SuccessResult<T> = {
  success: true;
  data: T;
  message?: string;
};

type FailureResult<T, U> = {
  success: false;
  message?: string;
  data?: U;
  zodErrors?: typeToFlattenedError<T>["fieldErrors"];
};

/**
 * @typeParam T - data to be returned if successful
 * @typeParam U - validation error by zod
 * @typeParam P - data to be returned if failed
 */
export type Result<T = void, U = Record<string, unknown>, P = never> =
  | SuccessResult<T>
  | FailureResult<U, P>;
