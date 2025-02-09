import type { Route } from "next";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const successUrl =
  // TODO
  `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/checkout?session_id={CHECKOUT_SESSION_ID}` as Route;
export const cancelUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;
