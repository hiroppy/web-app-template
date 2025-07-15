import type { SafeParseReturn } from "zod";

export function getFieldErrors<T, U>(parsedValues: SafeParseReturn<T, U>) {
  if (!parsedValues.success) {
    return parsedValues.error.flatten().fieldErrors;
  }

  return {};
}
