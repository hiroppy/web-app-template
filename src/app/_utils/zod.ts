import type { ZodSafeParseResult } from "zod";
import { flattenError } from "zod";

export function getFieldErrors<T>(parsedValues: ZodSafeParseResult<T>) {
  if (!parsedValues.success) {
    return flattenError<T>(parsedValues.error).fieldErrors;
  }

  return {};
}
