import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`;
export const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}`;
