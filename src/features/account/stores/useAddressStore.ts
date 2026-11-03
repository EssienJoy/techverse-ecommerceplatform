import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddressEntry } from "../schema";
import type { AddressState } from "../types";

export const useAddressStore = create<AddressState>()(
	persist(
		(set) => ({
			addresses: [],
			addAddress: (input) =>
				set((state) => {
					const entry: AddressEntry = {
						...input,
						id: crypto.randomUUID(),
						isDefault: state.addresses.length === 0,
					};

					return { addresses: [...state.addresses, entry] };
				}),
			removeAddress: (id) =>
				set((state) => {
					const addresses = state.addresses.filter((item) => item.id !== id);

					// Keep exactly one default address when the list is not empty.
					if (addresses.length > 0 && !addresses.some((item) => item.isDefault)) {
						addresses[0] = { ...addresses[0], isDefault: true };
					}

					return { addresses };
				}),
			setDefaultAddress: (id) =>
				set((state) => ({
					addresses: state.addresses.map((item) => ({
						...item,
						isDefault: item.id === id,
					})),
				})),
		}),
		{ name: "technest-addresses" },
	),
);
