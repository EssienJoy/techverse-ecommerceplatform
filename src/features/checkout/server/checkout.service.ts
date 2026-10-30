"use server";

import { restrictTo } from "@/features/auth/server/middleware/authorization";
import { getCart } from "@/features/cart/server/cart.service";
import { resolveCartItem } from "@/features/cart/lib/resolveCartItem";
import type { CartLine } from "@/features/cart/schema";
import type { Product } from "@/features/products/schema";
import { shippingAddressSchema } from "../schema";
import type {
	CheckoutActionState,
	CheckoutItem,
	ShippingAddress,
} from "../types";
import { startStripeCheckout } from "./checkout.session";

type ParsedAddress =
	| { ok: true; address: ShippingAddress }
	| { ok: false; message: string };

function parseAddress(formData: FormData): ParsedAddress {
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
			ok: false,
			message: parsed.error.issues[0]?.message ?? "Check the shipping address.",
		};
	}

	return { ok: true, address: parsed.data };
}

/**
 * Resolves each stored cart line against its product. Returns `null` when a
 * product has disappeared since it was added, so the caller can ask the
 * customer to review the cart instead of charging a short order.
 */
function toCheckoutItems(
	cart: CartLine[],
	products: Product[],
): CheckoutItem[] | null {
	const productsById = new Map(products.map((product) => [product.id, product]));

	const items = cart.flatMap((line) => {
		const product = productsById.get(line.productId);
		if (!product) return [];

		const item = resolveCartItem(line, product);

		return [
			{
				productId: item.productId,
				variationId: item.variationId,
				name: item.name,
				price: item.price,
				qty: line.qty,
			},
		];
	});

	return items.length === cart.length ? items : null;
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

	const parsed = parseAddress(formData);
	if (!parsed.ok) return { status: "error", message: parsed.message };

	const { cart, products } = await getCart({ userId: user.id });
	if (cart.length === 0) {
		return { status: "error", message: "Your cart is empty." };
	}

	const items = toCheckoutItems(cart, products);
	if (!items) {
		return {
			status: "error",
			message:
				"Some cart items are no longer available. Remove them to continue.",
		};
	}

	try {
		const url = await startStripeCheckout({
			userId: user.id,
			address: parsed.address,
			items,
		});

		// The client navigates to this URL. Handled there, not with `redirect()`,
		// because Stripe's hosted Checkout refuses to run inside an iframe: a
		// preview pane that embeds the store would leave the payment page framed.
		// The form sends the top-level window instead and offers a link when the
		// embed forbids it.
		return { status: "redirect", url };
	} catch (error) {
		console.error("Could not start a Stripe Checkout Session.", error);
		return { status: "error", message: "Could not start checkout. Try again." };
	}
}
