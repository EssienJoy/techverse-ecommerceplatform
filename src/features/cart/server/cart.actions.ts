"use server";

import { z } from "zod";
import type { CartLine } from "../schema";
import type { getProductsByIds } from "@/features/products/server/products.service";
import { resolveShopperOwner } from "./customer-user";
import {
	addItem,
	clearCart,
	getCart,
	removeItem,
	setQuantity,
} from "./cart.service";
import {
	actionSuccess,
	databaseError,
	type ActionOutcome,
} from "@/shared/lib/error";

const idSchema = z.string().uuid();

// Only adding an item creates a guest session. Reads, and changes to an
// existing cart, never do: a visitor with no session has nothing to change.
const readOwner = () => resolveShopperOwner({ create: false, admin: "none" });
const addOwner = () => resolveShopperOwner({ create: true, admin: "throw" });
const changeOwner = () => resolveShopperOwner({ create: false, admin: "throw" });

export async function getCartAction(): Promise<{
	cart: CartLine[];
	products: Awaited<ReturnType<typeof getProductsByIds>>;
}> {
	return getCart(await readOwner());
}

export async function addCartItemAction(
	productIdInput: string,
	variationIdInput?: string,
): Promise<ActionOutcome> {
	try {
		const owner = await addOwner();
		if (!owner) return actionSuccess();

		await addItem(
			owner,
			idSchema.parse(productIdInput),
			variationIdInput ? idSchema.parse(variationIdInput) : undefined,
		);

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not add this item to your cart.");
	}
}

/**
 * Returns the quantity actually applied, which may be lower than requested,
 * or null when there is no cart to change.
 */
export async function setCartItemQuantityAction(
	productIdInput: string,
	variationIdInput: string | undefined,
	quantity: number,
): Promise<ActionOutcome<number | null>> {
	try {
		const owner = await changeOwner();
		if (!owner) return actionSuccess(null);

		const applied = await setQuantity(
			owner,
			idSchema.parse(productIdInput),
			variationIdInput ? idSchema.parse(variationIdInput) : undefined,
			z.number().int().nonnegative().parse(quantity),
		);

		return actionSuccess(applied);
	} catch (error) {
		return databaseError(error, "Could not save this cart change.");
	}
}

export async function removeCartItemAction(
	productIdInput: string,
	variationIdInput?: string,
): Promise<ActionOutcome> {
	try {
		const owner = await changeOwner();
		if (!owner) return actionSuccess();

		await removeItem(
			owner,
			idSchema.parse(productIdInput),
			variationIdInput ? idSchema.parse(variationIdInput) : undefined,
		);

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not save this cart change.");
	}
}

export async function clearCartAction(): Promise<ActionOutcome> {
	try {
		const owner = await changeOwner();
		if (!owner) return actionSuccess();

		await clearCart(owner);

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not clear your cart.");
	}
}
