import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/shared/lib/utils";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

// One client per process: dev hot reloads would otherwise create a new one on
// every change.
export const stripe =
	globalForStripe.stripe ?? new Stripe(requireEnv("STRIPE_SECRET_KEY"));

if (process.env.NODE_ENV !== "production") {
	globalForStripe.stripe = stripe;
}

/**
 * Starts a Stripe Checkout Session. The browser is then sent to the returned
 * `url`, where Stripe collects the card details.
 */
export function createCheckoutSession(
	params: Stripe.Checkout.SessionCreateParams,
) {
	return stripe.checkout.sessions.create(params);
}

/**
 * Loads a Checkout Session by the `session_id` the browser sends back after
 * payment. Read-only: the caller must still check `payment_status` and that
 * the session belongs to the signed-in customer before trusting it.
 */
export function getCheckoutSession(sessionId: string) {
	return stripe.checkout.sessions.retrieve(sessionId, {
		expand: ["line_items.data.price.product", "payment_intent"],
	});
}
