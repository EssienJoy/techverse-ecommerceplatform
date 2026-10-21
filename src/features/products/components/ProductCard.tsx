"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/components/Button";
import { formatCurrency } from "@/shared/lib";
import type { Product } from "@/shared/lib";
import Link from "next/link";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import { isLowStock } from "@/features/products/lib/stock";

type ProductCardProps = {
	product: Product;
	oldPrice?: number;
	className?: string;
};

export function ProductCard({
	product,
	oldPrice,
	className,
}: ProductCardProps) {
	const cartStore = useCartStore((state) => state);
	const favoritesStore = useFavoritesStore((state) => state);
	const isTopRated =
		typeof product.rating === "number" && product.rating >= 4.7;
	const ratingLabel =
		typeof product.rating === "number" && product.rating > 0
			? product.rating.toFixed(1)
			: null;
	const hasDiscount = typeof oldPrice === "number" && oldPrice > product.price;
	const discountPercent = hasDiscount
		? Math.round(((oldPrice - product.price) / oldPrice) * 100)
		: 0;
	const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
	const [isVariationOpen, setIsVariationOpen] = useState(false);

	const selectedVariation =
		product.variations[selectedVariationIndex] ?? product.variations[0];
	const activePrice = selectedVariation?.price ?? product.price;
	const activeStock = selectedVariation?.stock ?? product.stock;
	const cartId = selectedVariation?.id ?? product.id;
	const cartItem = cartStore.cart.find(
		(item) => (item.variationId ?? item.productId) === cartId,
	);
	const isFavorite = favoritesStore.favorites.includes(product.id);

	return (
		<Link
			href={`/product/${product.id}`}
			className={cn(
				`group/card relative flex h-full flex-col gap-2 overflow-hidden
				rounded-xl border border-border/70
				bg-card py-2 shadow-sm`,
				className,
			)}>
			<section className='flex flex-1 flex-col'>
				<div className='relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white'>
					{product.imageUrl ? (
						<Image
							src={product.imageUrl}
							alt={product.name}
							fill
							sizes='(min-width: 1024px) 25vw, 50vw'
							className='object-contain'
						/>
					) : (
						<span className='relative flex size-14 items-center justify-center rounded-2xl bg-white/70 text-brand-600 shadow-sm backdrop-blur transition-transform duration-300 group-hover/card:scale-105'>
							<ShoppingBag className='size-6' />
						</span>
					)}

					<div className='absolute left-2 top-2 flex flex-col items-start gap-1'>
						{hasDiscount ? (
							<span className='rounded-full bg-danger px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm'>
								-{discountPercent}%
							</span>
						) : null}
						{isTopRated ? (
							<span className='inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700 shadow-sm backdrop-blur'>
								<Sparkles className='size-3' />
								Top rated
							</span>
						) : null}
					</div>

					<button
						type='button'
						aria-label={
							isFavorite ? "Remove from favorites" : "Add to favorites"
						}
						aria-pressed={isFavorite}
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							favoritesStore.toggleFavorite(product.id);
						}}
						className='absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-muted-foreground shadow-sm backdrop-blur transition-all hover:scale-105 hover:text-danger [&_svg]:transition-colors hover:[&_svg]:fill-danger'>
						<Heart
							className={cn("size-4", isFavorite && "fill-danger text-danger")}
						/>
					</button>

					{typeof activeStock === "number" &&
					(activeStock <= 0 || isLowStock(activeStock)) ? (
						<span
							className={cn(
								"absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm backdrop-blur",
								activeStock <= 0
									? "bg-danger-muted/95 text-danger-foreground"
									: "bg-warning-muted/95 text-warning-foreground",
							)}>
							{activeStock <= 0 ? "Out of stock" : `${activeStock} left`}
						</span>
					) : null}
				</div>

				<div className='flex flex-1 flex-col px-2.5 pb-1 pt-3'>
					<h3
						className='text-sm font-semibold leading-5 text-foreground
					 transition-colors group-hover/card:text-brand-700'>
						{product.name}
					</h3>

					{product.variations.length > 0 ? (
						<div
							className='relative mt-2'
							onBlur={(event) => {
								if (
									!event.currentTarget.contains(
										event.relatedTarget as Node | null,
									)
								) {
									setIsVariationOpen(false);
								}
							}}>
							<button
								type='button'
								aria-haspopup='listbox'
								aria-expanded={isVariationOpen}
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									setIsVariationOpen((value) => !value);
								}}
								className='flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:border-brand-300'>
								<span className='truncate'>
									{selectedVariation
										? `${selectedVariation.color} · ${selectedVariation.size}`
										: "Select option"}
								</span>
								<ChevronDown
									className={cn(
										"size-3.5 shrink-0 text-muted-foreground transition-transform",
										isVariationOpen && "rotate-180",
									)}
								/>
							</button>

							{isVariationOpen ? (
								<div
									role='listbox'
									className='absolute inset-x-0 bottom-full z-20 mb-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg'>
									{product.variations.map((variation, index) => {
										const selected = selectedVariationIndex === index;
										const isOutOfStock = variation.stock <= 0;
										const isLow = isLowStock(variation.stock);

										return (
											<button
												key={variation.id}
												type='button'
												role='option'
												aria-selected={selected}
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													setSelectedVariationIndex(index);
													setIsVariationOpen(false);
												}}
												className={cn(
													"flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] transition-colors hover:bg-surface-muted",
													selected && "bg-brand-50 text-brand-700",
													isOutOfStock && "text-muted-foreground",
												)}>
												<span
													className={cn(
														"min-w-0 truncate",
														isOutOfStock && "line-through",
													)}>
													{variation.color} · {variation.size}
												</span>
												<span className='flex shrink-0 items-center gap-1.5'>
													{isOutOfStock ? (
														<span className='rounded-full bg-danger-muted px-1.5 py-0.5 text-[9px] font-medium text-danger-foreground'>
															Out
														</span>
													) : isLow ? (
														<span className='rounded-full bg-warning-muted px-1.5 py-0.5 text-[9px] font-medium text-warning-foreground'>
															Low
														</span>
													) : null}
													{selected ? (
														<Check className='size-3.5' />
													) : null}
												</span>
											</button>
										);
									})}
								</div>
							) : null}
						</div>
					) : null}

					<div className='flex items-end gap-2 my-1'>
						<span className='text-lg font-bold text-primary'>
							{formatCurrency(activePrice)}
						</span>
						{oldPrice ? (
							<span className='pb-0.5 text-xs text-muted-foreground line-through'>
								{formatCurrency(oldPrice)}
							</span>
						) : null}
					</div>

					{ratingLabel ? (
						<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Star className='size-3.5 fill-amber-400 text-amber-400' />
							<span className='font-medium text-foreground'>
								{ratingLabel}
							</span>
							{typeof product.reviews === "number" && product.reviews > 0 ? (
								<span>({product.reviews})</span>
							) : null}
						</div>
					) : null}
				</div>
			</section>

			<div className='mt-auto px-2.5 pt-2'>
				{cartItem ? (
					<div className='flex items-center justify-between gap-2'>
						<Button
							size='sm'
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								cartStore.decreaseQty(cartId);
							}}>
							-
						</Button>
						<span>{cartItem.qty}</span>
						<Button
							size='sm'
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								cartStore.increaseQty(cartId);
							}}>
							+
						</Button>
					</div>
				) : (
					<Button
						size='sm'
						className='w-full'
						disabled={typeof activeStock === "number" && activeStock <= 0}
						onClick={(e) => {
							if (typeof activeStock === "number" && activeStock <= 0) {
								e.preventDefault();
								e.stopPropagation();
								return;
							}
							cartStore.addToCart(product.id, selectedVariation?.id);
							e.preventDefault();
							e.stopPropagation();
						}}>
						<ShoppingBag className='size-3.5' />
						{typeof activeStock === "number" && activeStock <= 0
							? "Out of stock"
							: "Add to cart"}
					</Button>
				)}
			</div>
		</Link>
	);
}
