import type Stripe from "stripe";
import { prisma } from "../_clients/prisma";

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

    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
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
