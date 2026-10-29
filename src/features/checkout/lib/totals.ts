export const TAX_RATE = 0.08;
export const SHIPPING_FEE = 19;
/** Orders above this subtotal ship for free. */
export const FREE_SHIPPING_THRESHOLD = 300;

/**
 * Shipping, tax and total for a cart subtotal. Shared by the client summary
 * and the server action that charges the card, so the two can't disagree.
 */
export function getCheckoutTotals(subtotal: number) {
	const shipping =
		subtotal === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const tax = subtotal * TAX_RATE;

	return { shipping, tax, total: subtotal + shipping + tax };
}
