import type { SafeParseReturnType } from "zod";

export function getFieldErrors<T>(parsedValues: SafeParseReturnType<any, T>) {
  if (!parsedValues.success) {
    return parsedValues.error.flatten().fieldErrors;
  }

  return {};
}
