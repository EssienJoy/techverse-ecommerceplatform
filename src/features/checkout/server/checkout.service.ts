"use server";

import { headers } from "next/headers";
import { restrictTo } from "@/features/auth/server/middleware/authorization";
import { getCart } from "@/features/cart/server/cart.service";
import { resolveCartItem } from "@/features/cart/lib/resolveCartItem";
import { siteConfig } from "@/shared/config";
import { shippingAddressSchema, type CheckoutActionState } from "../schema";
import { getCheckoutTotals } from "../lib/totals";
import { createCheckoutSession } from "./checkout.repository";

const CURRENCY = siteConfig.currency.toLowerCase();

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

type LineItemInput = {
	name: string;
	amount: number;
	quantity: number;
	kind: "product" | "tax";
	productId?: string;
	variationId?: string;
};

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
 * Turns the shipping form into a Stripe Checkout Session and returns the URL of
 * Stripe's hosted payment page for the browser to navigate to.
 *
 * Prices come from the cart in the database, never from the form, so a client
 * can't change what it is charged.
 */
export async function startCheckoutSession(
	_prevState: CheckoutActionState,
	formData: FormData,
): Promise<CheckoutActionState> {
	const user = await restrictTo("user", {
		redirect: true,
		next: "/checkout",
	});

	const parsed = shippingAddressSchema.safeParse({
		fullName: formData.get("fullname"),
		email: formData.get("email"),
		address: formData.get("address"),
		city: formData.get("city"),
		postalCode: formData.get("postalcode"),
		phone: formData.get("phone"),
	});

	if (!parsed.success) {
		return {
			status: "error",
			message: parsed.error.issues[0]?.message ?? "Check the shipping address.",
		};
	}

	const address = parsed.data;
	const { cart, products } = await getCart({ userId: user.id });

	if (cart.length === 0) {
		return { status: "error", message: "Your cart is empty." };
	}

	const productsById = new Map(
		products.map((product) => [product.id, product]),
	);
	const items = cart.flatMap((line) => {
		const product = productsById.get(line.productId);
		if (!product) return [];

		const item = resolveCartItem(line, product);
		return [{ ...item, qty: line.qty }];
	});

	if (items.length !== cart.length) {
		return {
			status: "error",
			message:
				"Some cart items are no longer available. Remove them to continue.",
		};
	}

	const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
	const { shipping, tax } = getCheckoutTotals(subtotal);

	const lineItems = items.map((item) =>
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

	const baseUrl = await getBaseUrl();

	let url: string;
	try {
		const session = await createCheckoutSession({
			mode: "payment",
			customer_email: address.email,
			client_reference_id: user.id,
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
				userId: user.id,
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

		url = session.url;
	} catch (error) {
		console.error("Could not start a Stripe Checkout Session.", error);
		return { status: "error", message: "Could not start checkout. Try again." };
	}

	// The client navigates to this URL. Handled there, not with `redirect()`,
	// because Stripe's hosted Checkout refuses to run inside an iframe: a
	// preview pane that embeds the store would leave the payment page framed.
	// The form sends the top-level window instead and offers a link when the
	// embed forbids it.
	return { status: "redirect", url };
}
