"use client";

import { useTransition } from "react";
import { update } from "../_actions/payment";
import { Button } from "./Button";

type Props = {
  cancelAtPeriodEnd: boolean;
};

export function PaymentCancelButton({ cancelAtPeriodEnd }: Props) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const { success } = await update(!cancelAtPeriodEnd);

      if (!success) {
        alert("internal error");
      }
    });
  };

  return (
    <Button onClick={onClick} disabled={isPending}>
      {cancelAtPeriodEnd ? "Resume" : "Cancel"}
    </Button>
  );
}
