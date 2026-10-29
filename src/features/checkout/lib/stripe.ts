"use client";

import { loadStripe } from "@stripe/stripe-js";

/**
 * The publishable key identifies the Stripe account to Stripe.js. Unlike the
 * secret key used in `checkout.repository.ts`, it is designed to be shipped to
 * the browser: it cannot create charges or read another customer's data, so it
 * lives here rather than in `.env`.
 */
export const STRIPE_PUBLISHABLE_KEY =
	"pk_test_51UVCGDACGx6vAuKw54JSPhuZQnQXPFpYoQxmFP9cLFfHKyyRtoKRKhKrRV0HkWPWrPAJEGmkia860OJ93jSc06bH00mVtLdABd";

/**
 * One Stripe.js instance per page load. Import this from client components.
 *
 * The hosted Checkout flow redirects to `session.url` and never calls
 * Stripe.js, so this module is only used once the app renders Stripe on its own
 * origin (embedded Checkout or Elements).
 */
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
