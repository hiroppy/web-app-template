import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "../../../_clients/prisma";
import { stripe } from "../../../_clients/stripe";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  let rawBody: Buffer;

  try {
    rawBody = Buffer.from(await req.arrayBuffer());
  } catch (err) {
    return new NextResponse("Error reading request body", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new NextResponse("Webhook signature verification failed", {
      status: 400,
    });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      try {
        await handleSubscriptionUpsert(subscription);
      } catch {
        return new NextResponse("Error upserting subscription", {
          status: 500,
        });
      }
      break;
    }

    default: {
      console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.findUnique({
      where: {
        stripeId: subscription.customer as string,
      },
    });

    if (!user) {
      // console.warn(
      //   `No user found for stripeCustomerId = ${}. Skipped.`,
      // );
      return;
    }

    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    await prisma.subscription.upsert({
      where: {
        subscriptionId: subscription.id,
      },
      create: {
        userId: user.id,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        status: subscription.status,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  });
}
