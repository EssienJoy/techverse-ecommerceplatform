import "server-only";
import type { CartLine } from "../schema";
import { getProductsByIds } from "@/features/products/server/products.service";
import { MAX_CART_LINES, MAX_QTY_PER_LINE } from "../lib/limits";
import type { ShopperOwner } from "./customer-user";
import {
	cartLineExists,
	clearCartLines,
	countCartLines,
	createCartLine,
	deleteCartLine,
	findCartLines,
	findPurchasable,
	findVariationStock,
	getOrCreateCartId,
	incrementLineBelowCap,
	isUniqueViolation,
	setLineQuantity,
} from "./cart.repository";

export class CartError extends Error {}

const itemKeyOf = (productId: string, variationId?: string) =>
	variationId ?? productId;

const capFor = (stock: number | null) =>
	stock === null ? MAX_QTY_PER_LINE : Math.min(MAX_QTY_PER_LINE, stock);

export async function getCart(owner: ShopperOwner | null): Promise<{
	cart: CartLine[];
	products: Awaited<ReturnType<typeof getProductsByIds>>;
}> {
	if (!owner) return { cart: [], products: [] };

	const lines = await findCartLines(owner);
	const cart = lines.map(({ productId, variationId, quantity }) => ({
		productId,
		...(variationId ? { variationId } : {}),
		qty: quantity,
	}));
	const products = await getProductsByIds([
		...new Set(lines.map(({ productId }) => productId)),
	]);

	return { cart, products };
}

export async function addItem(
	owner: ShopperOwner,
	productId: string,
	variationId?: string,
): Promise<void> {
	const purchasable = await findPurchasable(productId, variationId);
	if (!purchasable) {
		throw new CartError("This product or variation is unavailable.");
	}

	const itemKey = itemKeyOf(productId, variationId);
	const cap = capFor(purchasable.stock);
	const cartId = await getOrCreateCartId(owner);

	if (await incrementLineBelowCap(cartId, itemKey, cap)) return;

	if (await cartLineExists(cartId, itemKey)) {
		throw new CartError("You've reached the maximum quantity for this item.");
	}

	if ((await countCartLines(cartId)) >= MAX_CART_LINES) {
		throw new CartError("Your cart is full. Remove an item to add another.");
	}

	try {
		await createCartLine({ cartId, productId, variationId, itemKey });
	} catch (error) {
		// A concurrent request created the same line first; add to it instead.
		if (!isUniqueViolation(error)) throw error;
		await incrementLineBelowCap(cartId, itemKey, cap);
	}
}

/** Sets a line's quantity within stock and returns the quantity applied. */
export async function setQuantity(
	owner: ShopperOwner,
	productId: string,
	variationId: string | undefined,
	quantity: number,
): Promise<number> {
	const itemKey = itemKeyOf(productId, variationId);

	let applied = Math.min(quantity, MAX_QTY_PER_LINE);
	if (variationId) {
		const stock = await findVariationStock(productId, variationId);
		applied = Math.min(applied, stock ?? 0);
	}

	if (applied <= 0) {
		await deleteCartLine(owner, itemKey);
		return 0;
	}

	await setLineQuantity(owner, itemKey, applied);
	return applied;
}

export async function removeItem(
	owner: ShopperOwner,
	productId: string,
	variationId?: string,
): Promise<void> {
	await deleteCartLine(owner, itemKeyOf(productId, variationId));
}

export async function clearCart(owner: ShopperOwner): Promise<void> {
	await clearCartLines(owner);
}
