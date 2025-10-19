"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Subscription } from "../__generated__/prisma";
import { prisma } from "../_clients/prisma";
import { cancelUrl, paymentPage, stripe, successUrl } from "../_clients/stripe";
import type { Result } from "../_types/result";
import { getSessionOrReject } from "../_utils/auth";
import { handleSubscriptionUpsert, status } from "../_utils/payment";

export async function checkout(): Promise<Result> {
  const session = await getSessionOrReject();

  if (!session.success) {
    return session;
  }

  const me = await prisma.user.findUnique({
    where: {
      id: session.data.id,
    },
  });

  if (!me?.email) {
    return {
      success: false,
      message: "user not found",
    };
  }

  let stripeId = me.stripeId;

  if (!stripeId) {
    try {
      const customer = await stripe.customers.create({
        email: me.email,
        name: me.name ?? "-",
      });

      stripeId = customer.id;

      await prisma.user.update({
        where: {
          id: me.id,
        },
        data: {
          stripeId,
        },
      });
    } catch {
      return {
        success: false,
        message: "failed to create stripe customer",
      };
    }
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
    customer: stripeId,
    customer_update: {
      // for automatic_tax
      // shipping: "auto",
      address: "auto",
    },
    // shipping_address_collection: {
    //   // for automatic_tax
    //   allowed_countries: ["JP"],
    // },
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

  redirect(checkoutSession.url as Route);
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

    revalidatePath("/me/payment");

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

export async function redirectToBillingPortal(): Promise<void> {
  const session = await getSessionOrReject();

  if (!session.success) {
    throw new Error(session.message);
  }

  const me = await prisma.user.findUnique({
    where: {
      id: session.data.id,
    },
  });

  if (!me?.stripeId) {
    throw new Error("user not found");
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: me.stripeId,
    return_url: paymentPage,
  });

  redirect(portal.url as Route);
}
