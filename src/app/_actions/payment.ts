"use server";

import type { Subscription } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "../_clients/nextAuth";
import { prisma } from "../_clients/prisma";
import { cancelUrl, stripe, successUrl } from "../_clients/stripe";
import type { Result } from "./types";

export async function checkout(): Promise<Result> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "no session token",
    };
  }

  const me = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!me) {
    return {
      success: false,
      message: "user not found",
    };
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

// if you set multiple subscriptions, you need to pass the subscriptionId as an argument
export async function cancel(): Promise<Result> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "no session token",
    };
  }

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
        cancel_at_period_end: true,
      },
    );

    console.log(subscription);
  } catch {
    return {
      success: false,
      message: "subscription cancel failed",
    };
  }
}

type ReturnedStatus = Result<
  Pick<
    Subscription,
    "subscriptionId" | "invoiceId" | "cancelAtPeriodEnd" | "currentPeriodEnd"
  >
>;

// this sample code assumes that the user has only one subscription
export async function status(): Promise<ReturnedStatus> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "no session token",
    };
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
  });
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "complete",
  );

  if (activeSubscriptions.length === 0) {
    return {
      success: false,
      message: "subscription not found",
    };
  }

  const a = activeSubscriptions[0];

  return {
    success: true,
    data: {
      subscriptionId: a.subscriptionId,
      invoiceId: a.invoiceId,
      cancelAtPeriodEnd: a.cancelAtPeriodEnd,
      currentPeriodEnd: a.currentPeriodEnd,
    },
  };
}
