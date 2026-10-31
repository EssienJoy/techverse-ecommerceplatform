import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CardBrand, SavedCard } from "../schema";

type WalletState = {
	balance: number;
	cards: SavedCard[];
	addCard: (input: {
		last4: string;
		brand: CardBrand;
		expiry: string;
		makeDefault?: boolean;
	}) => void;
	removeCard: (id: string) => void;
	setDefaultCard: (id: string) => void;
};

/**
 * Saved cards hold only what the profile needs to show: the network, the last
 * four digits and the expiry. The full number and CVC are never stored; real
 * payments run on Stripe at checkout.
 */
export const useWalletStore = create<WalletState>()(
	persist(
		(set) => ({
			balance: 0,
			cards: [],
			addCard: ({ last4, brand, expiry, makeDefault }) =>
				set((state) => {
					const shouldBeDefault =
						makeDefault === true || state.cards.length === 0;
					const cards = state.cards.map((card) => ({
						...card,
						isDefault: shouldBeDefault ? false : card.isDefault,
					}));

					return {
						cards: [
							...cards,
							{
								id: crypto.randomUUID(),
								brand,
								last4,
								expiry,
								isDefault: shouldBeDefault,
							},
						],
					};
				}),
			removeCard: (id) =>
				set((state) => {
					const cards = state.cards.filter((card) => card.id !== id);

					if (cards.length > 0 && !cards.some((card) => card.isDefault)) {
						cards[0] = { ...cards[0], isDefault: true };
					}

					return { cards };
				}),
			setDefaultCard: (id) =>
				set((state) => ({
					cards: state.cards.map((card) => ({
						...card,
						isDefault: card.id === id,
					})),
				})),
		}),
		{ name: "technest-wallet" },
	),
);
