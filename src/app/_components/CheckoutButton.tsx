"use client";

import { useTransition } from "react";
import { checkout } from "../_actions/payment";
import { Button } from "./Button";

export function CheckoutButton() {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const { success } = await checkout();

      if (!success) {
        alert("internal error");
      }
    });
  };

  return (
    <Button onClick={onClick} disabled={isPending}>
      Checkout
    </Button>
  );
}
