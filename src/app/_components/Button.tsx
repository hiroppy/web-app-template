import clsx from "clsx";
import type { JSX } from "react";

type Props = JSX.IntrinsicElements["button"];

export function Button({ children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        "py-2 px-4 rounded-md text-sm text-gray-100 cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
