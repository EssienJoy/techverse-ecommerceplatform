import "server-only";

import { headers } from "next/headers";
import type Stripe from "stripe";
import { siteConfig } from "@/shared/config";
import { getCheckoutTotals } from "../lib/totals";
import type { CheckoutItem, LineItemInput, ShippingAddress } from "../types";
import { stripe } from "@/shared/lib/stripe";

const CURRENCY = siteConfig.currency.toLowerCase();

type StartCheckoutInput = {
	userId: string;
	address: ShippingAddress;
	items: CheckoutItem[];
};

/** Stripe charges in the currency's smallest unit (kobo for NGN). */
const toMinorUnits = (amount: number) => Math.round(amount * 100);

async function getBaseUrl() {
	const configured = process.env.NEXT_PUBLIC_APP_URL;
	if (configured) return configured.replace(/\/$/, "");

	// In development the host header is the most reliable source; in production
	// set NEXT_PUBLIC_APP_URL so redirects never depend on a proxy header.
	const headerList = await headers();
	const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
	const protocol = headerList.get("x-forwarded-proto") ?? "http";

	return host ? `${protocol}://${host}` : "http://localhost:3000";
}

function toLineItem(input: LineItemInput) {
	return {
		quantity: input.quantity,
		price_data: {
			currency: CURRENCY,
			unit_amount: toMinorUnits(input.amount),
			product_data: {
				name: input.name,
				metadata: {
					kind: input.kind,
					...(input.productId ? { productId: input.productId } : {}),
					...(input.variationId ? { variationId: input.variationId } : {}),
				},
			},
		},
	};
}

/**
 * Creates the Stripe Checkout Session for a priced cart and returns its hosted
 * URL.
 *
 * This is the only place that talks to Stripe. Everything above it decides what
 * the customer may buy and what it costs; this function just describes that cart
 * to Stripe. It throws when Stripe fails, so the caller can turn that into the
 * form's error state.
 */
export async function startStripeCheckout({
	userId,
	address,
	items,
}: StartCheckoutInput): Promise<string> {
	const baseUrl = await getBaseUrl();
	const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const { shipping, tax } = getCheckoutTotals(subtotal);

	const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
		(item) =>
			toLineItem({
				name: item.name,
				amount: item.price,
				quantity: item.qty,
				kind: "product",
				productId: item.productId,
				variationId: item.variationId,
			}),
	);

	// Stripe calls its line items "products", so tax gets its own labelled line
	// instead of Stripe Tax, which needs dashboard configuration.
	if (tax > 0) {
		lineItems.push(
			toLineItem({
				name: "Estimated tax",
				amount: tax,
				quantity: 1,
				kind: "tax",
			}),
		);
	}

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		customer_email: address.email,
		client_reference_id: userId,
		line_items: lineItems,
		...(shipping > 0
			? {
					shipping_options: [
						{
							shipping_rate_data: {
								type: "fixed_amount" as const,
								fixed_amount: {
									amount: toMinorUnits(shipping),
									currency: CURRENCY,
								},
								display_name: "Standard shipping",
							},
						},
					],
				}
			: {}),
		// Metadata values are limited to 500 characters each, so the address
		// goes in one key per field instead of a single JSON blob.
		metadata: {
			userId,
			ship_name: address.fullName,
			ship_email: address.email,
			ship_address: address.address,
			ship_city: address.city,
			ship_postal: address.postalCode,
			ship_phone: address.phone,
		},
		success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${baseUrl}/checkout`,
	});

	if (!session.url) {
		throw new Error("Stripe did not return a Checkout URL.");
	}

	return session.url;
}
