import Link from "next/link";
import { notFound } from "next/navigation";
import { status } from "../_actions/payment";
import { format } from "../_utils/date";
import { PaymentButton } from "./PaymentButton";

export async function Payment() {
  const { success, message, data } = await status();
  const limitDate = data?.cancelAtPeriodEnd ? data?.currentPeriodEnd : null;

  if (message === "no session token") {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="font-semibold text-lg">Subscription Status</h1>
      {data?.subscriptionId && <p className="text-sm">{data.subscriptionId}</p>}
      {!success ? (
        <p className="text-red-300">internal error</p>
      ) : (
        <PaymentButton
          hasSubscription={!!data}
          cancelAtPeriodEnd={!!data?.cancelAtPeriodEnd}
        />
      )}
      {limitDate && (
        <p className="text-sm text-gray-400">
          Available until {format(limitDate)}
        </p>
      )}
      <Link
        href="https://docs.stripe.com/testing#cards"
        referrerPolicy="no-referrer"
        target="_blank"
        className="underline"
      >
        DEBUG: Test card numbers
      </Link>
    </div>
  );
}
