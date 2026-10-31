"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { EmptyState, Skeleton, useAlertStore } from "@/shared";
import { useProductsByIds } from "@/features/products";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { SavedItemRow } from "./SavedItemRow";

type SavedListProps = {
	/** Cap the number of rows, e.g. for a dashboard preview. */
	limit?: number;
	emptyActionHref?: string;
	emptyActionLabel?: string;
};

/**
 * The saved items list, shared by the storefront Saved page and the profile
 * wishlist. It drops products the catalogue can no longer resolve and tells
 * the customer once, instead of leaving a broken row behind.
 */
export function SavedList({
	limit,
	emptyActionHref = "/shop",
	emptyActionLabel = "Browse products",
}: SavedListProps) {
	const favorites = useFavoritesStore((state) => state.favorites);
	const removeFromFavorites = useFavoritesStore(
		(state) => state.removeFromFavorites,
	);
	const showAlert = useAlertStore((state) => state.show);
	const { productsById, isLoading, missingIds } = useProductsByIds(favorites);
	const missingKey = missingIds.join("|");

	useEffect(() => {
		if (isLoading || !missingKey) return;

		missingKey.split("|").forEach((productId) => {
			removeFromFavorites(productId);
		});
		showAlert(
			"info",
			"Some saved items are no longer available and were removed.",
		);
	}, [isLoading, missingKey, removeFromFavorites, showAlert]);

	const savedProducts = favorites.flatMap((productId) => {
		const product = productsById.get(productId);

		return product ? [product] : [];
	});
	const visible = limit ? savedProducts.slice(0, limit) : savedProducts;

	if (isLoading && favorites.length > 0 && savedProducts.length === 0) {
		return (
			<div className='flex flex-col gap-3'>
				{favorites.map((productId) => (
					<Skeleton key={productId} className='h-28 w-full rounded-2xl' />
				))}
			</div>
		);
	}

	if (savedProducts.length === 0) {
		return (
			<EmptyState
				icon={Heart}
				title='No saved items yet'
				description='Tap the heart on any product to save it here for later.'
				actionLabel={emptyActionLabel}
				actionHref={emptyActionHref}
			/>
		);
	}

	return (
		<div className='flex flex-col gap-3'>
			{visible.map((product) => (
				<SavedItemRow key={product.id} product={product} />
			))}
		</div>
	);
}
