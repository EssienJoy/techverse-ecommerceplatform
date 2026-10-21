import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine } from "@/shared/lib";

type Cart = {
	cart: CartLine[];
	totalCartItems: number;
	addToCart: (productId: string, variationId?: string) => void;
	increaseQty: (variationId: string) => void;
	decreaseQty: (variationId: string) => void;
	removeFromCart: (variationId: string) => void;
	clearCart: () => void;
};

const cartLineId = (item: CartLine) => item.variationId ?? item.productId;

export const useCartStore = create<Cart>()(
	persist(
		(set) => ({
			cart: [],
			totalCartItems: 0,
			addToCart: (productId, variationId) =>
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
				}),
			increaseQty: (id) =>
				set((state) => {
					const cart = state.cart.map((item) =>
						cartLineId(item) === id ? { ...item, qty: item.qty + 1 } : item,
					);
					return { cart, totalCartItems: cart.length };
				}),
			decreaseQty: (id) =>
				set((state) => {
					const cart = state.cart
						.map((item) =>
							cartLineId(item) === id ? { ...item, qty: item.qty - 1 } : item,
						)
						.filter((item) => item.qty > 0);
					return { cart, totalCartItems: cart.length };
				}),
			removeFromCart: (id) =>
				set((state) => {
					const cart = state.cart.filter((item) => cartLineId(item) !== id);
					return { cart, totalCartItems: cart.length };
				}),
			clearCart: () => set({ cart: [], totalCartItems: 0 }),
		}),
		{ name: "technest-cart" },
	),
);
