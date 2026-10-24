import { create } from "zustand";
import { persist } from "zustand/middleware";
import { alert } from "@/shared";
import type { CartLine } from "@/shared/lib";
import {
	addCartItemAction,
	clearCartAction,
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
				void addCartItemAction(productId, variationId).catch(() => {
					alert.error("Could not save this cart change to your account.");
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
				void setCartItemQuantityAction(
					item.productId,
					item.variationId,
					item.qty + 1,
				).catch(() => {
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
