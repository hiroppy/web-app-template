"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useLayoutEffect, useRef } from "react";

type Props = PropsWithChildren<{
  dialogProps?: React.JSX.IntrinsicElements["dialog"];
  contentProps?: React.JSX.IntrinsicElements["div"];
}>;

export function Dialog({ children, dialogProps, contentProps }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  // to show backdrop
  useLayoutEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      // click backdrop to close
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          router.back();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          router.back();
        }
      }}
      {...dialogProps}
      className={clsx(
        "fixed m-auto w-[560px] h-[520px] bg-gray-800 rounded-sm border border-gray-500 backdrop:bg-gray-900/70 backdrop:backdrop-blur-sm",
        dialogProps?.className,
      )}
    >
      <div
        {...contentProps}
        className={clsx("text-gray-200 p-10 h-full", contentProps?.className)}
      >
        {children}
      </div>
    </dialog>
  );
}
