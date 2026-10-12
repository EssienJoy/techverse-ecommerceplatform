"use client";
import Image from "next/image";
import { Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import { cn } from "cn";
import { Button } from "./Button";
import { formatCurrency } from "../lib";
import type { ProductSummary } from "../types";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";
import { useFavoritesStore } from "../store/useFavoritesStore";

type ProductCardProps = {
	product: ProductSummary;
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
	// console.log(cartStore.cart);
	const isTopRated =
		typeof product.rating === "number" && product.rating >= 4.7;
	const hasDiscount = typeof oldPrice === "number" && oldPrice > product.price;
	const discountPercent = hasDiscount
		? Math.round(((oldPrice - product.price) / oldPrice) * 100)
		: 0;
	const isLowStock =
		typeof product.stock === "number" &&
		product.stock > 0 &&
		product.stock <= 8;
	const cartItem = cartStore.cart.find((p) => p.productId === product.id);
	const isFavorite = favoritesStore.favorites.includes(product.id);
	return (
		<Link
			href='/product/1'
			className={cn(
				` relative overflow-hidden 
				rounded-[26px] border border-border/70 bg-card space-y-2 pb-2 shadow-sm `,
				className,
			)}>
			<section>
				<div
					className='relative flex h-44 
				items-center justify-center 
				overflow-hidden bg-gradient-to-br from-brand-100
				 via-brand-50 to-brand-200'>
					<div
						aria-hidden
						className='pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-white/50 blur-2xl'
					/>
					<div
						aria-hidden
						className='pointer-events-none absolute -bottom-12 -left-8 size-28 rounded-full bg-brand-300/40 blur-2xl'
					/>

					{product.imageUrl ? (
						<Image
							src={product.imageUrl}
							alt={product.name}
							width={640}
							height={640}
							className='relative h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105'
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

					{isLowStock ? (
						<span className='absolute bottom-2 left-2 rounded-full bg-warning-muted/95 px-2 py-0.5 text-[10px] font-semibold text-warning-foreground shadow-sm backdrop-blur'>
							Only {product.stock} left
						</span>
					) : null}
				</div>

				<div className='flex flex-1 flex-col px-2.5 pb-1 pt-3'>
					<h3
						className=' 
					text-sm font-semibold leading-5 text-foreground
					 transition-colors group-hover/card:text-brand-700'>
						{product.name}
					</h3>

					<div className='flex items-end gap-2 my-1'>
						<span className='text-lg font-bold text-primary'>
							{formatCurrency(product.price)}
						</span>
						{oldPrice ? (
							<span className='pb-0.5 text-xs text-muted-foreground line-through'>
								{formatCurrency(oldPrice)}
							</span>
						) : null}
					</div>
					{typeof product.rating === "number" ? (
						<div
							className=' flex items-center gap-1.5 text-xs
						 text-muted-foreground'>
							<Star className='size-3.5 fill-amber-400 text-amber-400' />
							<span className='font-medium text-foreground'>
								{product.rating.toFixed(1)}
							</span>
							{typeof product.reviews === "number" ? (
								<span>({product.reviews})</span>
							) : null}
						</div>
					) : null}
				</div>
			</section>

			{cartItem ? (
				<div className='flex justify-between items-center px-2.5 '>
					<Button
						size='sm'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							cartStore.decreaseQty(product.id);
						}}>
						-
					</Button>
					<span>{cartItem.qty}</span>
					<Button
						size='sm'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							cartStore.increaseQty(product.id);
						}}>
						+
					</Button>
				</div>
			) : (
				<div className='px-2.5  grid'>
					<Button
						size='sm'
						onClick={(e) => {
							cartStore.addToCart(product.id);
							e.preventDefault();
							e.stopPropagation();
						}}>
						<ShoppingBag className='size-3.5' />
						Add to cart
					</Button>
				</div>
			)}
		</Link>
	);
}
