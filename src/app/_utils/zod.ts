import type { SafeParseReturnType } from "zod";

export function getFieldErrors<T, U>(parsedValues: SafeParseReturnType<T, U>) {
  if (!parsedValues.success) {
    return parsedValues.error.flatten().fieldErrors;
  }

  return {};
}
