import type { z } from "zod";
import type { shippingAddressSchema } from "./schema";

/** The shipping form, once it has passed `shippingAddressSchema`. */
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

/** Result of the "continue to payment" server action. */
export type CheckoutActionState =
	| { status: "idle" | "error"; message: string }
	| { status: "redirect"; url: string };

/** A cart line resolved against its product, ready to become a line item. */
export type CheckoutItem = {
	productId: string;
	variationId?: string;
	name: string;
	price: number;
	qty: number;
};

/** One Stripe line item before it is turned into `price_data`. */
export type LineItemInput = {
	name: string;
	amount: number;
	quantity: number;
	kind: "product" | "tax";
	productId?: string;
	variationId?: string;
};
