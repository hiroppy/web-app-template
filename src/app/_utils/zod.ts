import type { ZodSafeParseError } from "zod";

export function getFieldErrors<T>(parsedValues: ZodSafeParseError<T>) {
  if (!parsedValues.success) {
    return parsedValues.error.flatten().fieldErrors;
  }

  return {};
}
