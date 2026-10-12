import { create } from "zustand";

type CartData = {
	qty: number;
	productId: string;
};

type Cart = {
	cart: CartData[];
	addToCart: (id: string) => void;
	increaseQty: (id: string) => void;
	decreaseQty: (id: string) => void;
	removeFromCart: (id: string) => void;
	clearCart: () => void;
};

export const useCartStore = create<Cart>((set) => ({
	cart: [],
	addToCart: (id) =>
		set((state) => {
			const existing = state.cart.find((item) => item.productId === id);
			return {
				cart: existing
					? state.cart.map((item) =>
							item.productId === id ? { ...item, qty: item.qty + 1 } : item,
						)
					: [...state.cart, { productId: id, qty: 1 }],
			};
		}),
	increaseQty: (id) =>
		set((state) => ({
			cart: state.cart.map((item) =>
				item.productId === id ? { ...item, qty: item.qty + 1 } : item,
			),
		})),
	decreaseQty: (id) =>
		set((state) => ({
			cart: state.cart
				.map((item) =>
					item.productId === id ? { ...item, qty: item.qty - 1 } : item,
				)
				.filter((item) => item.qty > 0),
		})),
	removeFromCart: (id) =>
		set((state) => ({
			cart: state.cart.filter((item) => item.productId !== id),
		})),
	clearCart: () => set({ cart: [] }),
}));