"use client";

import { useEffect } from "react";
import { alert } from "@/shared";
import { seedProductsByIds } from "@/features/products/hooks/useProductsByIds";
import { useCartStore } from "../stores/useCartStore";
import { getCartAction } from "../server/cart.actions";
import { getSavedItemsAction } from "@/features/saved/server/saved.actions";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import { getViewerRoleAction } from "@/features/auth/server/auth.actions";
import { useViewerStore } from "@/features/auth/stores/useViewerStore";

export function ShoppingListsSync() {
	const replaceCart = useCartStore((state) => state.replaceCart);
	const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
	const setIsAdmin = useViewerStore((state) => state.setIsAdmin);

	useEffect(() => {
		let isMounted = true;

		void Promise.all([
			getCartAction(),
			getSavedItemsAction(),
			getViewerRoleAction(),
		])
			.then(([cartResult, savedItems, role]) => {
				if (!isMounted) return;

				const isAdmin = role === "admin" || role === "super_admin";
				setIsAdmin(isAdmin);
				if (isAdmin) {
					// Admins have no cart or saved items; clear anything left in this browser.
					replaceCart([]);
					replaceFavorites([]);
					return;
				}

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
	}, [replaceCart, replaceFavorites, setIsAdmin]);

	return null;
}
