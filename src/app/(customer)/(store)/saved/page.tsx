"use client";

import { products } from "@/app/(customer)/(store)/product";
import { Container, EmptyState } from "@/shared";
import { Header } from "../_components";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import { SavedItemRow } from "./components";

export default function SavedPage() {
	const favorites = useFavoritesStore((state) => state.favorites);

	const savedItems = products
		.filter((product) => favorites.includes(product.id))
		.map((product) => ({
			id: product.id,
			productId: product.id,
			name: product.name,
			price: product.price,
			imageUrl: product.imageUrl,
		}));

	return (
		<>
			<Header text='Saved' number={String(savedItems.length)} showBack={false} />
			<section>
				<Container>
					{savedItems.length === 0 ? (
						<div className='mt-6'>
							<EmptyState
								icon={Heart}
								title='No saved items yet'
								description='Tap the heart on any product to save it here for later.'
								actionLabel='Browse products'
								actionHref='/shop'
							/>
						</div>
					) : (
						<div className='mt-4 flex flex-col gap-3'>
							{savedItems.map((item) => (
								<SavedItemRow key={item.id} item={item} />
							))}
						</div>
					)}
				</Container>
			</section>
		</>
	);
}