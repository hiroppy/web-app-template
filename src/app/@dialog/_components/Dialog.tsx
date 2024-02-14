"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, useLayoutEffect, useRef } from "react";

type Props = PropsWithChildren;

export function Dialog({ children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  // to show backdrop
  useLayoutEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="fixed inset-0 w-[560px] h-[520px] bg-gray-800 rounded-sm border border-gray-500 backdrop:bg-gray-900/70 backdrop:backdrop-blur-sm"
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
    >
      <div className="text-gray-200 p-10 h-full">{children}</div>
    </dialog>
  );
}
