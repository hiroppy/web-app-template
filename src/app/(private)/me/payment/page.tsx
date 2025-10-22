import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { Suspense } from "react";
import { redirectToBillingPortal } from "../../../_actions/payment";
import { stripe } from "../../../_clients/stripe";
import { Button } from "../../../_components/Button";
import { format } from "../../../_utils/date";
import { status } from "../../../_utils/payment";
import { PaymentButton } from "./_components/PaymentButton";

type SearchParams = {
  sessionId?: string;
};

async function PaymentContent({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  unstable_noStore();

  const { sessionId } = await searchParams;

  if (sessionId) {
    const paymentInfo = await stripe.checkout.sessions.retrieve(sessionId);

    if (paymentInfo.status !== "complete") {
      // TODO:
    }
  }

  const { success, message, data } = await status();
  const limitDate = data?.cancelAtPeriodEnd ? data?.currentPeriodEnd : null;

  if (message === "no session token") {
    notFound();
  }

  return (
    <>
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
    </>
  );
}

export default function Page({ searchParams }: PageProps<"/me/payment">) {
  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="font-semibold text-lg">Subscription Status</h1>
      <Suspense fallback={<p className="text-sm">Loading...</p>}>
        <PaymentContent searchParams={searchParams} />
      </Suspense>
      <Link
        href="https://docs.stripe.com/testing#cards"
        referrerPolicy="no-referrer"
        target="_blank"
        className="underline"
      >
        DEBUG: Test card numbers
      </Link>
      <form action={redirectToBillingPortal}>
        <Button type="submit">Stripe Portal Page</Button>
      </form>
    </div>
  );
}
