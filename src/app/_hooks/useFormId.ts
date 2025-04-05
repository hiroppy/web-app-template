import { useId } from "react";

export function useFormId() {
  const id = useId();
  const errorId = `${id}-error`;

  return {
    id,
    errorId,
  } as const;
}
