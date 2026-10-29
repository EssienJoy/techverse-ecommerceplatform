"use client";

import { useMemo } from "react";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { resolveCartItem } from "@/features/cart/lib/resolveCartItem";
import { useProductsByIds } from "@/features/products";
import { getCheckoutTotals } from "./totals";

/**
 * Prices the cart lines for checkout. The form and the summary both read from
 * here so the totals and the "continue" state can't drift apart.
 */
export function useCheckoutOrder() {
	const cart = useCartStore((state) => state.cart);
	const productIds = useMemo(() => cart.map((line) => line.productId), [cart]);
	const { productsById, isLoading } = useProductsByIds(productIds);

	const items = cart.map((line) => {
		const product = productsById.get(line.productId);
		if (!product) {
			return { productId: line.productId, name: "", price: 0, qty: line.qty };
		}

		// Price the exact variation that was added, not the product's lowest price.
		const item = resolveCartItem(line, product);
		return {
			productId: item.productId,
			name: item.name,
			price: item.price,
			qty: item.quantity,
		};
	});

	const hasUnavailableProducts =
		!isLoading && items.some((item) => !item.name);
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const { shipping, tax, total } = getCheckoutTotals(subtotal);
	const canContinue = cart.length > 0 && !isLoading && !hasUnavailableProducts;

	return {
		items,
		isLoading,
		hasUnavailableProducts,
		subtotal,
		shipping,
		tax,
		total,
		canContinue,
	};
}
