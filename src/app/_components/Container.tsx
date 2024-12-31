import clsx from "clsx";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<
  React.JSX.IntrinsicElements["div"] & {
    size?: "sm" | "md" | "lg";
  }
>;

export function Container({
  children,
  className,
  size = "lg",
  ...rest
}: Props) {
  return (
    <div
      className={clsx(
        "container mx-auto px-4",
        size === "sm" && "py-2",
        size === "md" && "py-4",
        size === "lg" && "py-8",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
