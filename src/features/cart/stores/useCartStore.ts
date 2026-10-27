import { create } from "zustand";
import { persist } from "zustand/middleware";
import { alert } from "@/shared";
import type { CartLine } from "../schema";
import { blockAdminShopping } from "@/features/auth/stores/useViewerStore";
import {
	addCartItemAction,
	clearCartAction,
	getCartAction,
	removeCartItemAction,
	setCartItemQuantityAction,
} from "../server/cart.actions";

type Cart = {
	cart: CartLine[];
	totalCartItems: number;
	addToCart: (productId: string, variationId?: string) => void;
	increaseQty: (variationId: string) => void;
	decreaseQty: (variationId: string) => void;
	removeFromCart: (variationId: string) => void;
	clearCart: () => void;
	replaceCart: (cart: CartLine[]) => void;
};

const cartLineId = (item: CartLine) => item.variationId ?? item.productId;

export const useCartStore = create<Cart>()(
	persist(
		(set, get) => ({
			cart: [],
			totalCartItems: 0,
			addToCart: (productId, variationId) => {
				if (blockAdminShopping()) return;
				void addCartItemAction(productId, variationId).catch(() => {
					alert.error("Could not add this item to your cart.");
					// Roll the optimistic change back to what the server actually has.
					void getCartAction()
						.then((result) => get().replaceCart(result.cart))
						.catch(() => {});
				});
				set((state) => {
					const id = variationId ?? productId;
					const existing = state.cart.find((item) => cartLineId(item) === id);
					const cart = existing
						? state.cart.map((item) =>
								cartLineId(item) === id ? { ...item, qty: item.qty + 1 } : item,
							)
						: [...state.cart, { productId, variationId, qty: 1 }];
					return {
						cart,
						totalCartItems: cart.length,
					};
				});
			},
			increaseQty: (id) => {
				const item = get().cart.find((line) => cartLineId(line) === id);
				if (!item) return;
				const requested = item.qty + 1;
				void setCartItemQuantityAction(
					item.productId,
					item.variationId,
					requested,
				)
					.then((applied) => {
						// The server caps quantity at stock and the per-item limit.
						if (applied === null || applied >= requested) return;
						alert.error(
							applied > 0
								? `Only ${applied} available for this item.`
								: "This item is no longer available.",
						);
						set((state) => {
							const cart = state.cart
								.map((line) =>
									cartLineId(line) === id ? { ...line, qty: applied } : line,
								)
								.filter((line) => line.qty > 0);
							return { cart, totalCartItems: cart.length };
						});
					})
					.catch(() => {
						alert.error("Could not save this cart change to your account.");
					});
				set((state) => {
					const cart = state.cart.map((item) =>
						cartLineId(item) === id ? { ...item, qty: item.qty + 1 } : item,
					);
					return { cart, totalCartItems: cart.length };
				});
			},
			decreaseQty: (id) => {
				const item = get().cart.find((line) => cartLineId(line) === id);
				if (!item) return;
				void setCartItemQuantityAction(
					item.productId,
					item.variationId,
					item.qty - 1,
				).catch(() => {
					alert.error("Could not save this cart change to your account.");
				});
				set((state) => {
					const cart = state.cart
						.map((item) =>
							cartLineId(item) === id ? { ...item, qty: item.qty - 1 } : item,
						)
						.filter((item) => item.qty > 0);
					return { cart, totalCartItems: cart.length };
				});
			},
			removeFromCart: (id) => {
				const item = get().cart.find((line) => cartLineId(line) === id);
				if (!item) return;
				void removeCartItemAction(item.productId, item.variationId).catch(() => {
					alert.error("Could not save this cart change to your account.");
				});
				set((state) => {
					const cart = state.cart.filter((item) => cartLineId(item) !== id);
					return { cart, totalCartItems: cart.length };
				});
			},
			clearCart: () => {
				void clearCartAction().catch(() => {
					alert.error("Could not clear your saved cart.");
				});
				set({ cart: [], totalCartItems: 0 });
			},
			replaceCart: (cart) => set({ cart, totalCartItems: cart.length }),
		}),
		{ name: "technest-cart" },
	),
);
