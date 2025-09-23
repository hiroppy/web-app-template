"use client";

import { useTransition } from "react";
import { checkout, update } from "../../../../_actions/payment";
import { Button } from "../../../../_components/Button";

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
    <Button
      onClick={onClick}
      disabled={isPending}
      className="border border-gray-300 rounded"
    >
      {hasSubscription ? (cancelAtPeriodEnd ? "Resume" : "Cancel") : "Checkout"}
    </Button>
  );
}
