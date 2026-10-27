import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "../schema";

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