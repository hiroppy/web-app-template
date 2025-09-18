import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "../../../_clients/prisma";
import { stripe } from "../../../_clients/stripe";
import { handleSubscriptionUpsert } from "../../../_utils/payment";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing stripe-signature", {
      status: 400,
    });
  }

  let rawBody: Buffer;

  try {
    rawBody = Buffer.from(await req.arrayBuffer());
  } catch {
    return new NextResponse("Error reading request body", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
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

    case "customer.deleted": {
      const customer = event.data.object as Stripe.Customer;

      try {
        await prisma.$transaction(async (prisma) => {
          await prisma.user.update({
            where: {
              stripeId: customer.id,
            },
            data: {
              stripeId: null,
              subscriptions: {
                deleteMany: {},
              },
            },
          });
        });
      } catch {
        return new NextResponse("Error deleting customer", {
          status: 500,
        });
      }

      break;
    }

    default: {
      console.log(`Unhandled event type: ${event.type}`);
    }
  }

  return new NextResponse("received", {
    status: 200,
  });
}
