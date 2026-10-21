"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	Check,
	ChevronLeft,
	Heart,
	Minus,
	Plus,
	RotateCcw,
	ShieldCheck,
	ShoppingBag,
	Star,
	Truck,
} from "lucide-react";
import { cn } from "cn";
import { Button, Container, formatCurrency } from "@/shared";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import type { Product, ProductReviewItem } from "@/shared";
import { ProductReviewForm } from "./ProductReviewForm";

type ProductDetailProps = {
	product: Product;
	reviews?: ProductReviewItem[];
};

export function ProductDetail({ product, reviews = [] }: ProductDetailProps) {
	const router = useRouter();
	const cartStore = useCartStore((state) => state);
	const favoritesStore = useFavoritesStore((state) => state);

	const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
	const [activeImage, setActiveImage] = useState(0);
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [showHeader, setShowHeader] = useState(false);
	const titleRef = useRef<HTMLHeadingElement | null>(null);

	useEffect(() => {
		const title = titleRef.current;

		if (!title) return;

		let frame = 0;

		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				setShowHeader(title.getBoundingClientRect().bottom < 64);
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	const selectedVariation = product.variations[selectedVariationIndex];
	const isFavorite = favoritesStore.favorites.includes(product.id);
	const cartId = selectedVariation?.id ?? product.id;
	const cartItem = cartStore.cart.find(
		(item) => (item.variationId ?? item.productId) === cartId,
	);
	const quantity = cartItem?.qty ?? 1;
	const images = selectedVariation?.images.length
		? selectedVariation.images
		: [product.imageUrl];
	const imageIndex = Math.min(activeImage, images.length - 1);
	const activePrice = selectedVariation?.price ?? product.price;
	const activeStock = selectedVariation?.stock ?? product.stock;
	const hasReviews = product.reviews > 0;
	const meta = [product.category, product.brand].filter(Boolean).join(" · ");

	return (
		<div className='min-h-screen pb-28'>
			<header
				className={cn(
					"fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200",
					showHeader
						? "border-border bg-background/90 backdrop-blur"
						: "border-transparent",
				)}>
				<div className='mx-auto flex h-14 max-w-7xl items-center gap-2 px-4'>
					<button
						type='button'
						aria-label='Go back'
						onClick={() => router.back()}
						className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur transition-colors hover:bg-muted'>
						<ChevronLeft className='size-4' />
					</button>

					<span
						className={cn(
							"min-w-0 flex-1 truncate text-sm font-semibold transition-opacity duration-200",
							showHeader ? "opacity-100" : "opacity-0",
						)}>
						{product.name}
					</span>

					<button
						type='button'
						aria-label={
							isFavorite ? "Remove from favorites" : "Add to favorites"
						}
						aria-pressed={isFavorite}
						onClick={() => favoritesStore.toggleFavorite(product.id)}
						className='flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur transition-colors hover:bg-muted'>
						<Heart
							className={cn(
								"size-4 text-foreground transition-colors",
								isFavorite && "fill-danger text-danger",
							)}
						/>
					</button>
				</div>
			</header>

			<section className='relative w-full bg-card'>
				<div className='relative h-[52vh] w-full sm:h-[62vh] lg:h-[72vh]'>
					<Image
						src={images[imageIndex]}
						alt={product.name}
						fill
						priority
						className='object-contain p-6 sm:p-10'
					/>
				</div>
			</section>

			{images.length > 1 ? (
				<Container className='mt-3'>
					<div className='flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
						{images.map((src, index) => (
							<button
								key={`${src}-${index}`}
								type='button'
								aria-label={`Show image ${index + 1}`}
								aria-pressed={imageIndex === index}
								onClick={() => setActiveImage(index)}
								className={cn(
									"relative size-16 shrink-0 overflow-hidden rounded-xl border bg-card transition-colors",
									imageIndex === index
										? "border-brand-500"
										: "border-border hover:border-muted-foreground",
								)}>
								<Image
									src={src}
									alt=''
									width={160}
									height={160}
									className='size-full object-contain p-1'
								/>
							</button>
						))}
					</div>
				</Container>
			) : null}

			<Container className='py-8 sm:py-10'>
				<div className='mx-auto flex max-w-3xl flex-col gap-12'>
					<section className='flex flex-col gap-6'>
						<div className='flex flex-col gap-2'>
							{meta ? (
								<span className='text-xs text-muted-foreground'>{meta}</span>
							) : null}
							<h1
								ref={titleRef}
								className='text-2xl leading-tight font-bold tracking-tight sm:text-3xl'>
								{product.name}
							</h1>

							<div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground'>
								{hasReviews ? (
									<>
										<span className='inline-flex items-center gap-1'>
											<Star className='size-3.5 fill-amber-400 text-amber-400' />
											<span className='font-medium text-foreground'>
												{product.rating.toFixed(1)}
											</span>
										</span>
										<span className='text-border'>·</span>
									</>
								) : null}
								<span>
									{product.reviews}{" "}
									{product.reviews === 1 ? "review" : "reviews"}
								</span>
								<span className='text-border'>·</span>
								<span className={cn(activeStock <= 0 && "text-danger")}>
									{activeStock <= 0
										? "Out of stock"
										: activeStock <= 10
											? `Only ${activeStock} left`
											: "In stock"}
								</span>
							</div>
						</div>

						<div className='flex items-baseline gap-3'>
							<span className='text-3xl font-bold tracking-tight text-foreground'>
								{formatCurrency(activePrice)}
							</span>
							{selectedVariation ? (
								<span className='text-xs text-muted-foreground'>
									SKU {selectedVariation.sku}
								</span>
							) : null}
						</div>

						<p className='leading-7 text-muted-foreground'>
							{product.description}
						</p>

						{product.variations.length > 0 ? (
							<div className='flex flex-col gap-2'>
								<span className='text-xs font-medium text-muted-foreground'>
									Options
								</span>
								<div className='flex flex-wrap gap-2'>
									{product.variations.map((variation, index) => {
										const selected = selectedVariationIndex === index;

										return (
											<button
												key={variation.id ?? variation.sku}
												type='button'
												aria-pressed={selected}
												disabled={variation.stock === 0}
												onClick={() => {
													setSelectedVariationIndex(index);
													setActiveImage(0);
												}}
												className={cn(
													"rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
													selected
														? "border-brand-500 bg-brand-50"
														: "border-border hover:border-muted-foreground",
												)}>
												<span className='block font-medium'>
													{variation.color} · {variation.size}
												</span>
												<span className='block text-xs text-muted-foreground'>
													{formatCurrency(variation.price)}
												</span>
											</button>
										);
									})}
								</div>
							</div>
						) : null}

						<div className='grid gap-2 text-xs text-muted-foreground sm:grid-cols-3'>
							<span className='inline-flex items-center gap-2'>
								<Truck className='size-4' />
								Free shipping over $300
							</span>
							<span className='inline-flex items-center gap-2'>
								<ShieldCheck className='size-4' />
								2-year warranty
							</span>
							<span className='inline-flex items-center gap-2'>
								<RotateCcw className='size-4' />
								Free 30-day returns
							</span>
						</div>
					</section>

					{(product.features?.length ?? 0) > 0 ? (
						<section>
							<h2 className='text-base font-semibold'>Features</h2>
							<ul className='mt-3 grid gap-2 sm:grid-cols-2'>
								{product.features!.map((feature) => (
									<li
										key={feature}
										className='flex items-start gap-2 text-sm text-muted-foreground'>
										<Check className='mt-0.5 size-4 shrink-0 text-brand-600' />
										{feature}
									</li>
								))}
							</ul>
						</section>
					) : null}

					<section>
						<div className='flex flex-wrap items-center justify-between gap-3'>
							<h2 className='text-base font-semibold'>
								Reviews
								<span className='ml-2 text-sm font-normal text-muted-foreground'>
									{product.reviews}
								</span>
							</h2>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => setShowReviewForm((value) => !value)}>
								{showReviewForm ? "Close" : "Write a review"}
							</Button>
						</div>

						<div className='mt-3'>
							{hasReviews ? (
								<div className='flex items-center gap-2 border-b border-border py-3 text-sm'>
									<Star className='size-3.5 fill-amber-400 text-amber-400' />
									<span className='font-medium'>
										{product.rating.toFixed(1)}
									</span>
									<span className='text-muted-foreground'>
										out of 5 · {product.reviews}{" "}
										{product.reviews === 1 ? "review" : "reviews"}
									</span>
								</div>
							) : (
								<p className='border-b border-border py-4 text-sm text-muted-foreground'>
									No reviews yet. Be the first to review this product.
								</p>
							)}

							<div className='divide-y divide-border'>
								{reviews.map((review) => (
									<article key={review.id} className='py-4'>
										<div className='flex flex-wrap items-center justify-between gap-2'>
											<span className='text-sm font-medium'>
												{review.reviewerName?.trim() || "Anonymous"}
											</span>
											<span className='text-xs text-muted-foreground'>
												{new Date(review.createdAt).toLocaleDateString()}
											</span>
										</div>
										{review.title ? (
											<p className='mt-1 text-sm font-medium'>{review.title}</p>
										) : null}
										<p className='mt-1 text-sm leading-6 text-muted-foreground'>
											{review.body}
										</p>
									</article>
								))}
							</div>

							{showReviewForm ? (
								<div className='pt-4'>
									<ProductReviewForm
										productId={product.id}
										onSubmitted={() => setShowReviewForm(false)}
									/>
								</div>
							) : null}
						</div>
					</section>
				</div>
			</Container>

			<div className='fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur'>
				<Container className='flex items-center justify-between gap-4 py-3'>
					<div className='flex flex-col'>
						<span className='text-[11px] text-muted-foreground'>Total</span>
						<span className='text-lg leading-tight font-bold'>
							{formatCurrency(activePrice * quantity)}
						</span>
					</div>

					{cartItem ? (
						<div className='flex items-center gap-1 rounded-full border border-border p-1'>
							<Button
								variant='ghost'
								size='icon'
								aria-label='Decrease quantity'
								disabled={cartItem.qty <= 1}
								onClick={() => cartStore.decreaseQty(cartId)}
								className='size-8 rounded-full'>
								<Minus className='size-4' />
							</Button>
							<span className='w-7 text-center text-sm font-semibold'>
								{cartItem.qty}
							</span>
							<Button
								variant='ghost'
								size='icon'
								aria-label='Increase quantity'
								onClick={() => cartStore.increaseQty(cartId)}
								className='size-8 rounded-full'>
								<Plus className='size-4' />
							</Button>
						</div>
					) : (
						<Button
							disabled={activeStock <= 0}
							className='h-10 gap-2 rounded-full px-5'
							onClick={() =>
								cartStore.addToCart(product.id, selectedVariation?.id)
							}>
							<ShoppingBag className='size-4' />
							{activeStock <= 0 ? "Out of stock" : "Add to cart"}
						</Button>
					)}
				</Container>
			</div>
		</div>
	);
}
