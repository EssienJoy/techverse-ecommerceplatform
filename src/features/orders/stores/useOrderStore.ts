import { create } from "zustand";
import { persist } from "zustand/middleware";

export type OrderItem = {
	productId: string;
	name: string;
	price: number;
	qty: number;
};

export type OrderShipping = {
	fullName: string;
	address: string;
	city: string;
	phone: string;
};

export type Order = {
	id: string;
	items: OrderItem[];
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
	placedAt: string;
	shippingAddress: OrderShipping;
};

type OrderState = {
	orders: Order[];
	addOrder: (order: Order) => void;
};

export const useOrderStore = create<OrderState>()(
	persist(
		(set) => ({
			orders: [],
			addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
		}),
		{ name: "technest-orders" },
	),
);