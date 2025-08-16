import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentPage = `${process.env.NEXT_PUBLIC_SITE_URL}/me/payment`;
export const successUrl = `${paymentPage}?sessionId={CHECKOUT_SESSION_ID}`;
export const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}`;
