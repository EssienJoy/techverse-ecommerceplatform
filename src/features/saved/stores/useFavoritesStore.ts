import { create } from "zustand";
import { persist } from "zustand/middleware";
import { alert } from "@/shared";
import { blockAdminShopping } from "@/features/auth/stores/useViewerStore";
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

const reportError = (result: { status: "error"; message: string }) =>
	alert.error(result.message);

export const useFavoritesStore = create<Favorites>()(
	persist(
		(set, get) => ({
			favorites: [],
			addToFavorites: (productId) => {
				if (blockAdminShopping()) return;
				if (get().favorites.includes(productId)) return;
				void setSavedItemAction(productId, true).then((result) => {
					if (result.status === "error") reportError(result);
				});
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites
						: [...state.favorites, productId],
				}));
			},
			removeFromFavorites: (productId) => {
				void setSavedItemAction(productId, false).then((result) => {
					if (result.status === "error") reportError(result);
				});
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
				}));
			},
			toggleFavorite: (productId) => {
				if (blockAdminShopping()) return;
				const isSaved = get().favorites.includes(productId);
				void setSavedItemAction(productId, !isSaved).then((result) => {
					if (result.status === "error") reportError(result);
				});
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites.filter((id) => id !== productId)
						: [...state.favorites, productId],
				}));
			},
			isFavorite: (productId) => get().favorites.includes(productId),
			clearFavorites: () => {
				void clearSavedItemsAction().then((result) => {
					if (result.status === "error") reportError(result);
				});
				set({ favorites: [] });
			},
			replaceFavorites: (favorites) => set({ favorites }),
		}),
		{ name: "technest-favorites" },
	),
);
