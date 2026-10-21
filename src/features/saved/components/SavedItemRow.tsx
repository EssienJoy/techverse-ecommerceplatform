"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "cn";
import { Button, formatCurrency } from "@/shared";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import type { Product } from "@/shared";

type SavedItemRowProps = {
	product: Product;
};

export function SavedItemRow({ product }: SavedItemRowProps) {
	const favoritesStore = useFavoritesStore((state) => state);
	const cartStore = useCartStore((state) => state);
	const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

	const selectedVariation = product.variations[selectedVariationIndex];
	const activePrice = selectedVariation?.price ?? product.price;
	const activeStock = selectedVariation?.stock ?? product.stock;
	const imageUrl = selectedVariation?.images[0] ?? product.imageUrl;
	const cartId = selectedVariation?.id ?? product.id;
	const cartItem = cartStore.cart.find(
		(item) => (item.variationId ?? item.productId) === cartId,
	);
	const outOfStock = typeof activeStock === "number" && activeStock <= 0;

	return (
		<div className='relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-sm'>
			<div className='flex gap-2'>
				<Link
					href={`/product/${product.id}`}
					className='relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-brand-100'>
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={product.name}
							fill
							sizes='96px'
							className='object-contain'
						/>
					) : (
						<Heart className='size-7 text-brand-700' />
					)}
					<span className='absolute left-2 top-2 rounded-full bg-white/85 px-1.5 py-0.5 text-[10px] font-medium tracking-[0.12em] text-brand-700 uppercase shadow-sm'>
						Saved
					</span>
				</Link>

				<div className='flex min-w-0 flex-1 flex-col justify-between gap-2'>
					<div className='flex items-start justify-between gap-2'>
						<div className='min-w-0'>
							<p className='mb-1 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase'>
								Saved item
							</p>
							<Link
								href={`/product/${product.id}`}
								className='line-clamp-2 text-sm leading-5 font-semibold text-foreground'>
								{product.name}
							</Link>
						</div>

						<Button
							type='button'
							variant='ghost'
							size='icon-sm'
							className='rounded-full text-danger hover:bg-muted hover:text-danger'
							aria-label='Remove from saved'
							onClick={() => favoritesStore.toggleFavorite(product.id)}>
							<Heart className='size-4 fill-danger' />
						</Button>
					</div>

					{product.variations.length > 1 ? (
						<div className='flex flex-wrap gap-1'>
							{product.variations.map((variation, index) => {
								const selected = selectedVariationIndex === index;
								const variationOutOfStock = variation.stock === 0;

								return (
									<button
										key={variation.id}
										type='button'
										disabled={variationOutOfStock}
										aria-pressed={selected}
										title={`${variation.color} · ${variation.size} — ${formatCurrency(
											variation.price,
										)}${variationOutOfStock ? " · Out of stock" : ""}`}
										onClick={() => setSelectedVariationIndex(index)}
										className={cn(
											"rounded-full border px-1.5 py-0.5 text-[10px] font-medium transition-colors disabled:line-through disabled:opacity-40",
											selected
												? "border-brand-500 bg-brand-50 text-brand-700"
												: "border-border text-muted-foreground hover:border-brand-300",
										)}>
										{variation.color} · {variation.size}
									</button>
								);
							})}
						</div>
					) : null}

					<div className='flex items-end justify-between gap-3'>
						<div className='flex flex-col'>
							<span className='text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase'>
								Price
							</span>
							<span className='text-base font-bold text-primary'>
								{formatCurrency(activePrice)}
							</span>
						</div>

						{cartItem ? (
							<div className='flex items-center gap-1'>
								<Button
									type='button'
									variant='outline'
									size='icon-sm'
									aria-label='Decrease quantity'
									disabled={cartItem.qty <= 1}
									onClick={() => cartStore.decreaseQty(cartId)}>
									<Minus />
								</Button>
								<span className='w-6 text-center text-sm font-semibold'>
									{cartItem.qty}
								</span>
								<Button
									type='button'
									variant='outline'
									size='icon-sm'
									aria-label='Increase quantity'
									onClick={() => cartStore.increaseQty(cartId)}>
									<Plus />
								</Button>
							</div>
						) : (
							<Button
								type='button'
								variant='outline'
								size='icon-sm'
								aria-label={outOfStock ? "Out of stock" : "Add to cart"}
								title={outOfStock ? "Out of stock" : "Add to cart"}
								disabled={outOfStock}
								className='rounded-full border-border/80 bg-background/80 text-foreground shadow-sm transition-colors hover:bg-brand-50 hover:text-brand-700'
								onClick={() =>
									cartStore.addToCart(product.id, selectedVariation?.id)
								}>
								<ShoppingCart className='size-4' />
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
