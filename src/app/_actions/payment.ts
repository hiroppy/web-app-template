"use server";

import type { Subscription } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "../_clients/prisma";
import { cancelUrl, stripe, successUrl } from "../_clients/stripe";
import { handleSubscriptionUpsert } from "../_utils/payment";
import { getSessionOrReject } from "./auth";
import type { Result } from "./types";

export async function checkout(): Promise<Result> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    automatic_tax: {
      enabled: true,
    },
    shipping_address_collection: {
      // for automatic_tax
      allowed_countries: ["JP"],
    },
    currency: "jpy",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  if (!checkoutSession.url) {
    return {
      success: false,
      message: "checkoutSession url not found",
    };
  }

  redirect(checkoutSession.url);
}

type ReturnedUpdate = Result<
  Pick<
    Subscription,
    "subscriptionId" | "currentPeriodEnd" | "cancelAtPeriodEnd"
  >
>;

// if you set multiple subscriptions, you need to pass the subscriptionId as an argument
export async function update(
  cancelAtPeriodEnd: boolean,
): Promise<ReturnedUpdate> {
  const { success, data } = await status();

  if (!success || !data) {
    return {
      success: false,
      message: "subscription not found",
    };
  }

  try {
    const subscription = await stripe.subscriptions.update(
      data.subscriptionId,
      {
        cancel_at_period_end: cancelAtPeriodEnd,
      },
    );
    const res = await handleSubscriptionUpsert(subscription);

    if (!res) {
      throw new Error("subscription update failed");
    }

    return {
      success: true,
      data: {
        subscriptionId: res.subscriptionId,
        currentPeriodEnd: res.currentPeriodEnd,
        cancelAtPeriodEnd: res.cancelAtPeriodEnd,
      },
    };
  } catch {
    return {
      success: false,
      message: "subscription update failed",
    };
  }
}

type ReturnedStatus = Result<Pick<
  Subscription,
  "subscriptionId" | "cancelAtPeriodEnd" | "currentPeriodEnd"
> | null>;

// this sample code assumes that the user has only one subscription
export async function status(): Promise<ReturnedStatus> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const { user } = session.data;
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
  });
  const activeSubscriptions = subscriptions.filter((subscription) =>
    ["active", "complete"].includes(subscription.status),
  );

  if (activeSubscriptions.length === 0) {
    return {
      success: true,
      data: null,
      message: "subscription not found",
    };
  }

  const subscription = activeSubscriptions[0];

  return {
    success: true,
    data: {
      subscriptionId: subscription.subscriptionId,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
    },
  };
}
