import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, AddressInput } from "../schema";

type AddressState = {
	addresses: Address[];
	addAddress: (input: AddressInput) => void;
	updateAddress: (id: string, input: AddressInput) => void;
	removeAddress: (id: string) => void;
	setDefaultAddress: (id: string) => void;
};

const createId = () =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useAddressStore = create<AddressState>()(
	persist(
		(set) => ({
			addresses: [],
			addAddress: (input) =>
				set((state) => {
					const isFirst = state.addresses.length === 0;
					const address: Address = {
						...input,
						id: createId(),
						isDefault: isFirst,
					};

					return {
						addresses: isFirst
							? [
									address,
									...state.addresses.map((item) => ({
										...item,
										isDefault: false,
									})),
								]
							: [address, ...state.addresses],
					};
				}),
			updateAddress: (id, input) =>
				set((state) => ({
					addresses: state.addresses.map((address) =>
						address.id === id ? { ...address, ...input } : address,
					),
				})),
			removeAddress: (id) =>
				set((state) => {
					const remaining = state.addresses.filter(
						(address) => address.id !== id,
					);

					if (remaining.length === 0) return { addresses: [] };
					if (remaining.some((address) => address.isDefault)) {
						return { addresses: remaining };
					}

					return {
						addresses: remaining.map((address, index) => ({
							...address,
							isDefault: index === 0,
						})),
					};
				}),
			setDefaultAddress: (id) =>
				set((state) => {
					if (!state.addresses.some((address) => address.id === id)) {
						return state;
					}

					return {
						addresses: state.addresses.map((address) => ({
							...address,
							isDefault: address.id === id,
						})),
					};
				}),
		}),
		{ name: "technest-addresses" },
	),
);
