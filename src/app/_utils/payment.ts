"use server";

import type Stripe from "stripe";
import type { Subscription } from "../__generated__/prisma";
import { prisma } from "../_clients/prisma";
import { getSessionOrReject } from "./auth";

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
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: {
        in: ["active", "complete"],
      },
    },
  });

  if (!subscription) {
    return {
      success: true,
      data: null,
      message: "subscription not found",
    };
  }

  return {
    success: true,
    data: {
      subscriptionId: subscription.subscriptionId,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currentPeriodEnd: subscription.currentPeriodEnd,
    },
  };
}

export async function handleSubscriptionUpsert(
  subscription: Stripe.Subscription,
) {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        stripeId: `${subscription.customer}`,
      },
    });

    if (!user) {
      console.warn(`No user found for ${subscription.id}`);

      return;
    }

    // support only one subscription for now
    const item = subscription.items.data[0];
    const currentPeriodEnd = new Date(item.current_period_end * 1000);
    const { id, status, cancel_at_period_end } = subscription;
    const res = await prisma.subscription.upsert({
      where: {
        subscriptionId: subscription.id,
      },
      create: {
        userId: user.id,
        subscriptionId: id,
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd: cancel_at_period_end,
      },
      update: {
        status,
        currentPeriodEnd,
        cancelAtPeriodEnd: cancel_at_period_end,
      },
    });

    return res;
  });
}
