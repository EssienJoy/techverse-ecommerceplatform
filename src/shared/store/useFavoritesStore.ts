import { create } from "zustand";

type Favorites = {
	favorites: string[];
	addToFavorites: (productId: string) => void;
	removeFromFavorites: (productId: string) => void;
	toggleFavorite: (productId: string) => void;
	isFavorite: (productId: string) => boolean;
};

export const useFavoritesStore = create<Favorites>((set, get) => ({
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
}));