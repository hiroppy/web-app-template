import { useId } from "react";

export function useFormId() {
  const id = useId();
  const errorId = `${id}-error`;

  return <const>{
    id,
    errorId,
  };
}
