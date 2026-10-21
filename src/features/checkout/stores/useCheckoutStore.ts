import { create } from "zustand";

export type CheckoutShipping = {
	fullName: string;
	email: string;
	address: string;
	city: string;
	phone: string;
	postalCode: string;
};

type CheckoutState = {
	shipping: CheckoutShipping | null;
	setShipping: (shipping: CheckoutShipping) => void;
	clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
	shipping: null,
	setShipping: (shipping) => set({ shipping }),
	clearCheckout: () => set({ shipping: null }),
}));