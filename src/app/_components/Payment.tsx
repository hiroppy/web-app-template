import { status } from "../_actions/payment";
import { format } from "../_utils/date";
import { PaymentButton } from "./PaymentButton";

export async function Payment() {
  const { success, message, data } = await status();
  const limitDate = data?.cancelAtPeriodEnd ? data?.currentPeriodEnd : null;

  if (message === "no session token") {
    return null;
  }

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">Subscription Status</h3>
        {!success ? (
          <p className="text-red-300">internal error</p>
        ) : (
          <PaymentButton
            hasSubscription={!!data}
            cancelAtPeriodEnd={!!data?.cancelAtPeriodEnd}
          />
        )}
      </div>
      {data?.subscriptionId && <p className="text-sm">{data.subscriptionId}</p>}
      {limitDate && (
        <p className="text-sm text-gray-400">
          Available until {format(limitDate)}
        </p>
      )}
    </div>
  );
}
