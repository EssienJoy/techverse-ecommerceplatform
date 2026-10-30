import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedCard, SavedCardInput } from "../schema";

type PaymentState = {
	cards: SavedCard[];
	/** Store credit from refunds or promotions. Applied at checkout when present. */
	walletBalance: number;
	addCard: (input: SavedCardInput) => void;
	removeCard: (id: string) => void;
	setDefaultCard: (id: string) => void;
};

const createId = () =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const usePaymentStore = create<PaymentState>()(
	persist(
		(set) => ({
			cards: [],
			walletBalance: 0,
			addCard: (input) =>
				set((state) => {
					const isFirst = state.cards.length === 0;
					const card: SavedCard = {
						...input,
						id: createId(),
						isDefault: isFirst,
					};

					return {
						cards: isFirst
							? [
									card,
									...state.cards.map((item) => ({
										...item,
										isDefault: false,
									})),
								]
							: [card, ...state.cards],
					};
				}),
			removeCard: (id) =>
				set((state) => {
					const remaining = state.cards.filter((card) => card.id !== id);

					if (remaining.length === 0) return { cards: [] };
					if (remaining.some((card) => card.isDefault)) {
						return { cards: remaining };
					}

					return {
						cards: remaining.map((card, index) => ({
							...card,
							isDefault: index === 0,
						})),
					};
				}),
			setDefaultCard: (id) =>
				set((state) => {
					if (!state.cards.some((card) => card.id === id)) return state;

					return {
						cards: state.cards.map((card) => ({
							...card,
							isDefault: card.id === id,
						})),
					};
				}),
		}),
		{ name: "technest-payment" },
	),
);
