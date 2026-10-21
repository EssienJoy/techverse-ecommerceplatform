"use client";

import { Container, EmptyState, Skeleton } from "@/shared";
import { Header } from "@/features/navigation";
import { Heart } from "lucide-react";
import { SavedItemRow } from "@/features/saved";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import { useProductsByIds } from "@/features/products";

export default function SavedPage() {
	const favorites = useFavoritesStore((state) => state.favorites);
	const { productsById } = useProductsByIds(favorites);

	const savedProducts = favorites.flatMap((productId) => {
		const product = productsById.get(productId);

		return product ? [product] : [];
	});

	return (
		<>
			<Header
				text='Saved'
				number={String(favorites.length)}
				showBack={false}
				saved
			/>
			<section>
				<Container>
					{favorites.length > 0 && savedProducts.length === 0 ? (
						<div className='flex flex-col gap-2'>
							{favorites.map((productId) => (
								<Skeleton
									key={productId}
									className='h-28 w-full rounded-2xl'
								/>
							))}
						</div>
					) : savedProducts.length === 0 ? (
						<div className=''>
							<EmptyState
								icon={Heart}
								title='No saved items yet'
								description='Tap the heart on any product to save it here for later.'
								actionLabel='Browse products'
								actionHref='/shop'
							/>
						</div>
					) : (
						<div className='flex flex-col gap-2'>
							{savedProducts.map((product) => (
								<SavedItemRow key={product.id} product={product} />
							))}
						</div>
					)}
				</Container>
			</section>
		</>
	);
}
