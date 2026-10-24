"use client";

import { useEffect } from "react";
import { alert } from "@/shared";
import { seedProductsByIds } from "@/features/products/hooks/useProductsByIds";
import { useCartStore } from "../stores/useCartStore";
import { getCartAction } from "../server/cart.actions";
import { getSavedItemsAction } from "@/features/saved/server/saved.actions";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";

export function ShoppingListsSync() {
	const replaceCart = useCartStore((state) => state.replaceCart);
	const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);

	useEffect(() => {
		let isMounted = true;

		void Promise.all([getCartAction(), getSavedItemsAction()])
			.then(([cartResult, savedItems]) => {
				if (!isMounted) return;
				if (cartResult) {
					replaceCart(cartResult.cart);
					seedProductsByIds(cartResult.products);
				}
				if (savedItems) replaceFavorites(savedItems);
			})
			.catch(() => {
				if (isMounted) {
					alert.error("Could not load your saved cart and items.");
				}
			});

		return () => {
			isMounted = false;
		};
	}, [replaceCart, replaceFavorites]);

	return null;
}
