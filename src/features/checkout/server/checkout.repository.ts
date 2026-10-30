import "server-only";
import { stripe } from "@/shared/lib/stripe";

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
