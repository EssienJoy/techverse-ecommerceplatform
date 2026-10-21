import { create } from "zustand";
import { persist } from "zustand/middleware";

type Favorites = {
	favorites: string[];
	addToFavorites: (productId: string) => void;
	removeFromFavorites: (productId: string) => void;
	toggleFavorite: (productId: string) => void;
	isFavorite: (productId: string) => boolean;
	clearFavorites: () => void;
};

export const useFavoritesStore = create<Favorites>()(
	persist(
		(set, get) => ({
			favorites: [],
			addToFavorites: (productId) =>
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites
						: [...state.favorites, productId],
				})),
			removeFromFavorites: (productId) =>
				set((state) => ({
					favorites: state.favorites.filter((id) => id !== productId),
				})),
			toggleFavorite: (productId) =>
				set((state) => ({
					favorites: state.favorites.includes(productId)
						? state.favorites.filter((id) => id !== productId)
						: [...state.favorites, productId],
				})),
			isFavorite: (productId) => get().favorites.includes(productId),
			clearFavorites: () => set({ favorites: [] }),
		}),
		{ name: "technest-favorites" },
	),
);
