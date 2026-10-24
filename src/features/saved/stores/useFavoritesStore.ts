import { create } from "zustand";
import { persist } from "zustand/middleware";
import { alert } from "@/shared";
import {
	clearSavedItemsAction,
	setSavedItemAction,
} from "../server/saved.actions";

type Favorites = {
	favorites: string[];
	addToFavorites: (productId: string) => void;
	removeFromFavorites: (productId: string) => void;
	toggleFavorite: (productId: string) => void;
	isFavorite: (productId: string) => boolean;
	clearFavorites: () => void;
	replaceFavorites: (favorites: string[]) => void;
};

export const useFavoritesStore = create<Favorites>()(
	persist(
		(set, get) => ({
			favorites: [],
			addToFavorites: (productId) => {
				if (get().favorites.includes(productId)) return;
				void setSavedItemAction(productId, true).catch(() => {
					alert.error("Could not save this item to your account.");
				});
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites
						: [...state.favorites, productId],
				}));
			},
			removeFromFavorites: (productId) => {
				void setSavedItemAction(productId, false).catch(() => {
					alert.error("Could not update your saved items.");
				});
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
				}));
			},
			toggleFavorite: (productId) => {
				const isSaved = get().favorites.includes(productId);
				void setSavedItemAction(productId, !isSaved).catch(() => {
					alert.error("Could not update your saved items.");
				});
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites.filter((id) => id !== productId)
						: [...state.favorites, productId],
				}));
			},
			isFavorite: (productId) => get().favorites.includes(productId),
			clearFavorites: () => {
				void clearSavedItemsAction().catch(() => {
					alert.error("Could not clear your saved items.");
				});
				set({ favorites: [] });
			},
			replaceFavorites: (favorites) => set({ favorites }),
		}),
		{ name: "technest-favorites" },
	),
);
