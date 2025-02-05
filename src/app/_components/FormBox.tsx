import type { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  id: string;
  errorId: string;
  error?: string;
  label?: string;
}>;

export function FormBox({ id, errorId, error, label, children }: Props) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="flex items-center gap-2">{children}</div>
      {error && (
        <span key={error} className="text-red-300 text-sm" id={errorId}>
          {error}
        </span>
      )}
    </div>
  );
}
