import { create } from "zustand";
import type { ShippingAddress } from "../schema";

type CheckoutState = {
	shipping: ShippingAddress | null;
	setShipping: (shipping: ShippingAddress) => void;
	clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
	shipping: null,
	setShipping: (shipping) => set({ shipping }),
	clearCheckout: () => set({ shipping: null }),
}));