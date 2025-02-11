"use client";

import { useTransition } from "react";
import { checkout, update } from "../_actions/payment";
import { Button } from "./Button";

type Props = {
  hasSubscription: boolean;
  cancelAtPeriodEnd: boolean;
};

export function PaymentButton({ hasSubscription, cancelAtPeriodEnd }: Props) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const { success } = hasSubscription
        ? await update(!cancelAtPeriodEnd)
        : await checkout();

      if (!success) {
        alert("internal error");
      }
    });
  };

  return (
    <Button onClick={onClick} disabled={isPending}>
      {hasSubscription ? (cancelAtPeriodEnd ? "Resume" : "Cancel") : "Checkout"}
    </Button>
  );
}
