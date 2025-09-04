import type { ZodSafeParseResult } from "zod";
import { flattenError } from "zod";

export function getFieldErrors<T>(parsedValues: ZodSafeParseResult<T>) {
  if (!parsedValues.success) {
    return flattenError(parsedValues.error).fieldErrors;
  }

  return {};
}
