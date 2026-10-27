"use client";

import { useState } from "react";
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
import type { Product, ProductReviewItem } from "../schema";
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
	const activeFeatures = selectedVariation?.features ?? [];
	const hasReviews = product.reviews > 0;
	const meta = [product.category, product.brand].filter(Boolean).join(" · ");

	const addToCart = () =>
		cartStore.addToCart(product.id, selectedVariation?.id);

	const quantityControl = (className?: string) =>
		cartItem ? (
			<div
				className={cn(
					"flex items-center gap-1 rounded-full border border-border p-1",
					className,
				)}>
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
		) : null;

	return (
		<div className='min-h-screen pb-24 lg:pb-16'>
			<header className='pointer-events-none fixed inset-x-0 top-0 z-50'>
				<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4'>
					<button
						type='button'
						aria-label='Go back'
						onClick={() => router.back()}
						className='pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-105'>
						<ChevronLeft className='size-4' />
					</button>

					<button
						type='button'
						aria-label={
							isFavorite ? "Remove from favorites" : "Add to favorites"
						}
						aria-pressed={isFavorite}
						onClick={() => favoritesStore.toggleFavorite(product.id)}
						className='pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/90 text-muted-foreground shadow-sm backdrop-blur transition-transform hover:scale-105 hover:text-danger'>
						<Heart
							className={cn(
								"size-4 transition-colors",
								isFavorite && "fill-danger text-danger",
							)}
						/>
					</button>
				</div>
			</header>

			<section className='relative w-full overflow-hidden bg-surface-muted/40'>
				<div className='relative mx-auto h-[54vh] max-w-7xl sm:h-[64vh] lg:h-[76vh]'>
					<Image
						src={images[imageIndex]}
						alt={product.name}
						fill
						priority
						sizes='100vw'
						className='object-contain px-4 pb-12 pt-20 sm:px-8 sm:pb-16 lg:px-12'
					/>
				</div>
			</section>

			{images.length > 1 ? (
				<Container className='relative z-10 -mt-8'>
					<div className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
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

			<Container className='relative z-10 -mt-6 pb-12 sm:-mt-10'>
				<div className='mx-auto max-w-6xl rounded-3xl border border-border/70 bg-background p-5 sm:p-8 lg:p-10'>
					{meta ? (
						<p className='text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground'>
							{meta}
						</p>
					) : null}

					<h1 className='mt-2 max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl'>
						{product.name}
					</h1>

					<div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm'>
						{hasReviews ? (
							<span className='inline-flex items-center gap-1.5'>
								<Star className='size-4 fill-amber-400 text-amber-400' />
								<span className='font-medium'>{product.rating.toFixed(1)}</span>
								<span className='text-muted-foreground'>
									({product.reviews})
								</span>
							</span>
						) : (
							<span className='text-muted-foreground'>No reviews yet</span>
						)}
						<span className='text-border'>/</span>
						<span
							className={cn(
								"inline-flex items-center gap-1.5",
								activeStock <= 0
									? "text-danger"
									: activeStock <= 10
										? "text-warning-foreground"
										: "text-muted-foreground",
							)}>
							<span className='size-1.5 rounded-full bg-current' />
							{activeStock <= 0
								? "Out of stock"
								: activeStock <= 10
									? `Only ${activeStock} left`
									: "In stock"}
						</span>
					</div>

					<div className='mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12'>
						<aside className='order-first h-fit lg:order-last lg:sticky lg:top-24'>
							<div className='rounded-2xl border border-border/70 bg-surface-muted/40 p-5'>
								<div className='flex items-center justify-between gap-3'>
									<span className='text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground'>
										Price
									</span>
									<span
										className={cn(
											"text-[11px] font-medium",
											activeStock <= 0
												? "text-danger"
												: "text-muted-foreground",
										)}>
										{activeStock <= 0
											? "Out of stock"
											: activeStock <= 10
												? `Only ${activeStock} left`
												: "In stock"}
									</span>
								</div>

								<p className='mt-1 text-3xl font-semibold tracking-tight'>
									{formatCurrency(activePrice)}
								</p>

								{selectedVariation ? (
									<p className='mt-1.5 text-xs text-muted-foreground'>
										{selectedVariation.color} · {selectedVariation.size} · SKU{" "}
										{selectedVariation.sku}
									</p>
								) : null}

								<div className='mt-5 hidden items-center gap-2 lg:flex'>
									{quantityControl()}
									<Button
										disabled={activeStock <= 0}
										className='h-10 flex-1 gap-2 rounded-full px-4'
										onClick={addToCart}>
										<ShoppingBag className='size-4' />
										{activeStock <= 0 ? "Out of stock" : "Add to cart"}
									</Button>
								</div>

								<div className='mt-5 flex flex-col gap-2 border-t border-border/70 pt-4 text-xs text-muted-foreground'>
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
							</div>
						</aside>

						<div>
							{product.variations.length > 0 ? (
								<div>
									<div className='flex items-center justify-between gap-2'>
										<span className='text-sm font-medium'>Select option</span>
										{selectedVariation ? (
											<span className='text-xs text-muted-foreground'>
												{selectedVariation.color} · {selectedVariation.size}
											</span>
										) : null}
									</div>
									<div className='mt-2.5 flex flex-wrap gap-2'>
										{product.variations.map((variation, index) => {
											const selected = selectedVariationIndex === index;

											return (
											<button
												key={variation.id ?? variation.sku}
												type='button'
												aria-pressed={selected}
												onClick={() => {
													setSelectedVariationIndex(index);
													setActiveImage(0);
												}}
												className={cn(
													"inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
													selected
														? "border-brand-500 bg-brand-50 text-brand-700"
														: "border-border hover:border-muted-foreground",
													variation.stock === 0 && "text-muted-foreground",
												)}>
												{variation.color} · {variation.size}
												{variation.stock === 0 ? (
													<span className='text-[10px] font-medium uppercase text-danger'>
														Out
													</span>
												) : null}
											</button>
											);
										})}
									</div>
								</div>
							) : null}

							<div className='mt-6 border-t border-border pt-5'>
								<h2 className='text-sm font-medium'>Description</h2>
								<p className='mt-2 text-sm leading-7 text-muted-foreground'>
									{product.description}
								</p>
							</div>

							{activeFeatures.length > 0 ? (
								<div className='mt-6 border-t border-border pt-5'>
									<h2 className='text-sm font-medium'>Highlights</h2>
									<ul className='mt-3 grid gap-2 sm:grid-cols-2'>
										{activeFeatures.map((feature, index) => (
											<li
												key={`${feature}-${index}`}
												className='flex items-start gap-2 text-sm text-muted-foreground'>
												<Check className='mt-0.5 size-4 shrink-0 text-brand-600' />
												{feature}
											</li>
										))}
									</ul>
								</div>
							) : null}
						</div>
					</div>
				</div>

				<section className='mx-auto mt-10 max-w-6xl border-t border-border pt-8'>
					<div className='flex flex-wrap items-center justify-between gap-3'>
						<div>
							<h2 className='text-lg font-semibold'>Reviews</h2>
							<p className='mt-0.5 text-sm text-muted-foreground'>
								{hasReviews
									? `${product.rating.toFixed(1)} out of 5 · ${product.reviews} ${
											product.reviews === 1 ? "review" : "reviews"
										}`
									: "No reviews yet. Be the first to review this product."}
							</p>
						</div>
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='rounded-full'
							onClick={() => setShowReviewForm((value) => !value)}>
							{showReviewForm ? "Close" : "Write a review"}
						</Button>
					</div>

					{reviews.length > 0 ? (
						<div className='mt-5 max-w-3xl divide-y divide-border'>
							{reviews.map((review) => (
								<article key={review.id} className='py-4 first:pt-0'>
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
					) : null}

					{showReviewForm ? (
						<div className='mt-5 max-w-3xl'>
							<ProductReviewForm
								productId={product.id}
								onSubmitted={() => setShowReviewForm(false)}
							/>
						</div>
					) : null}
				</section>
			</Container>

			<div className='fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur lg:hidden'>
				<Container className='flex items-center justify-between gap-4 py-3'>
					<div className='flex flex-col'>
						<span className='text-[11px] text-muted-foreground'>Total</span>
						<span className='text-lg leading-tight font-bold'>
							{formatCurrency(activePrice * quantity)}
						</span>
					</div>

					{cartItem ? (
						quantityControl()
					) : (
						<Button
							disabled={activeStock <= 0}
							className='h-10 gap-2 rounded-full px-5'
							onClick={addToCart}>
							<ShoppingBag className='size-4' />
							{activeStock <= 0 ? "Out of stock" : "Add to cart"}
						</Button>
					)}
				</Container>
			</div>
		</div>
	);
}
