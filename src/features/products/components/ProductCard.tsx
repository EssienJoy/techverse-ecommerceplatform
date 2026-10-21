"use client";
import {
	useRef,
	useState,
	type MouseEvent,
	type TouchEvent,
} from "react";
import Image from "next/image";
import {
	ChevronLeft,
	ChevronRight,
	Heart,
	ShoppingBag,
	Sparkles,
	Star,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/components/Button";
import { formatCurrency } from "@/shared/lib";
import type { Product } from "@/shared/lib";
import Link from "next/link";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";

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
	// console.log(cartStore.cart);
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
	const [activeImage, setActiveImage] = useState(0);
	const swipeStart = useRef<number | null>(null);
	const didSwipe = useRef(false);

	const selectedVariation = product.variations[selectedVariationIndex];
	const images = selectedVariation?.images.length
		? selectedVariation.images
		: product.imageUrl
			? [product.imageUrl]
			: [];
	const imageIndex = Math.min(activeImage, Math.max(images.length - 1, 0));
	const currentImage = images[imageIndex] ?? product.imageUrl;
	const activePrice = selectedVariation?.price ?? product.price;
	const activeStock = selectedVariation?.stock ?? product.stock;
	const cartId = selectedVariation?.id ?? product.id;
	const cartItem = cartStore.cart.find(
		(item) => (item.variationId ?? item.productId) === cartId,
	);
	const isFavorite = favoritesStore.favorites.includes(product.id);

	const selectVariation = (index: number) => {
		setSelectedVariationIndex(index);
		setActiveImage(0);
	};

	const selectImage = (index: number) => setActiveImage(index);

	const showPreviousImage = () => {
		if (images.length < 2) return;
		setActiveImage((imageIndex - 1 + images.length) % images.length);
	};

	const showNextImage = () => {
		if (images.length < 2) return;
		setActiveImage((imageIndex + 1) % images.length);
	};

	const handleTouchStart = (event: TouchEvent) => {
		swipeStart.current = event.touches[0].clientX;
		didSwipe.current = false;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (swipeStart.current === null) return;

		const delta = event.changedTouches[0].clientX - swipeStart.current;
		swipeStart.current = null;

		if (Math.abs(delta) < 40) return;

		didSwipe.current = true;

		if (delta > 0) showPreviousImage();
		else showNextImage();
	};

	const handleCardClick = (event: MouseEvent) => {
		if (!didSwipe.current) return;

		event.preventDefault();
		event.stopPropagation();
		didSwipe.current = false;
	};
	return (
		<Link
			href={`/product/${product.id}`}
			onClick={handleCardClick}
			className={cn(
				`group/card relative overflow-hidden 
				rounded-xl border border-border/70 
				bg-card space-y-2 py-2 shadow-sm `,
				className,
			)}>
			<section>
				<div
					className='relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white'
					onTouchStart={handleTouchStart}
					onTouchEnd={handleTouchEnd}>
					{currentImage ? (
						<Image
							src={currentImage}
							alt={product.name}
							fill
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

					{images.length > 1 ? (
						<>
							<button
								type='button'
								aria-label='Previous image'
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									showPreviousImage();
								}}
								className='absolute top-1/2 left-1 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/card:opacity-100'>
								<ChevronLeft className='size-3.5' />
							</button>
							<button
								type='button'
								aria-label='Next image'
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									showNextImage();
								}}
								className='absolute top-1/2 right-1 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-opacity hover:bg-white sm:opacity-0 sm:group-hover/card:opacity-100'>
								<ChevronRight className='size-3.5' />
							</button>

							<div className='absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/85 px-1.5 py-1 shadow-sm backdrop-blur'>
								{images.map((image, index) => (
									<button
										key={`${image}-${index}`}
										type='button'
										aria-label={`Show image ${index + 1}`}
										aria-pressed={imageIndex === index}
										onClick={(event) => {
											event.preventDefault();
											event.stopPropagation();
											selectImage(index);
										}}
										className={cn(
											"h-1.5 rounded-full transition-all",
											imageIndex === index
												? "w-3 bg-brand-500"
												: "w-1.5 bg-black/20 hover:bg-black/40",
										)}
									/>
								))}
							</div>
						</>
					) : null}

					{typeof activeStock === "number" && activeStock <= 8 ? (
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
						className=' 
					text-sm font-semibold leading-5 text-foreground
					 transition-colors group-hover/card:text-brand-700'>
						{product.name}
					</h3>

					{product.variations.length > 1 ? (
						<div className='mt-1.5 flex flex-wrap gap-1'>
							{product.variations.map((variation, index) => {
								const selected = selectedVariationIndex === index;
								const outOfStock = variation.stock === 0;

								return (
									<button
										key={variation.id}
										type='button'
										disabled={outOfStock}
										aria-pressed={selected}
										title={`${variation.color} · ${variation.size} — ${formatCurrency(
											variation.price,
										)}${outOfStock ? " · Out of stock" : ""}`}
										onClick={(event) => {
											event.preventDefault();
											event.stopPropagation();
											selectVariation(index);
										}}
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
						<div
							className=' flex items-center gap-1.5 text-xs
						 text-muted-foreground'>
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

			{cartItem ? (
				<div className='flex justify-between items-center px-2.5 '>
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
				<div className='px-2.5  grid'>
					<Button
						size='sm'
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
				</div>
			)}
		</Link>
	);
}
