import clsx from "clsx";
import type { JSX } from "react";
import { FormBox, type Props as FormBoxProps } from "./FormBox";

type Props = JSX.IntrinsicElements["input"] &
  Omit<FormBoxProps, "id" | "errorId">;

export function Input({ className, error, label, ...rest }: Props) {
  const id = `input-${rest.name}`;
  const errorId = `${id}-error`;

  return (
    <FormBox id={id} errorId={errorId} error={error} label={label}>
      <input
        // ignore 1password
        data-1p-ignore
        {...rest}
        id={id}
        className={clsx(
          "w-full bg-gray-600 text-gray-100 focus:outline-none py-3 px-5 rounded-sm",
          error && "border border-red-300",
          className,
        )}
        aria-invalid={error ? "true" : "false"}
        aria-errormessage={error ? errorId : undefined}
      />
    </FormBox>
  );
}
