"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Heart,
	MessageSquare,
	Minus,
	Monitor,
	Plus,
	RotateCcw,
	ShieldCheck,
	Smartphone,
	ShoppingBag,
	Star,
	Truck,
} from "lucide-react";
import { cn } from "cn";
import {
	Button,
	Container,
	Link,
	ProductCard,
	formatCurrency,
} from "@/shared";
import { products } from "@/app/(customer)/(store)/product";
import { useCartStore } from "@/shared/store/useCartStore";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";
import type { Product } from "../types";

const galleryViews = [
	{ id: "front", label: "Front", icon: Smartphone },
	{ id: "back", label: "Back", icon: RotateCcw },
	{ id: "side", label: "Side", icon: Monitor },
] as const;

type GalleryViewId = (typeof galleryViews)[number]["id"];

const demoReviews = [
	{
		id: 1,
		author: "Tola A.",
		rating: 5,
		comment: "Absolutely love it. Feels premium right out of the box.",
	},
	{
		id: 2,
		author: "Kemi O.",
		rating: 4,
		comment: "Great value for the price, battery life is solid too.",
	},
	{
		id: 3,
		author: "Bayo S.",
		rating: 5,
		comment: "Fast delivery and the product works exactly as described.",
	},
];

type ProductDetailProps = {
	product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
	const router = useRouter();
	const cartStore = useCartStore((state) => state);
	const favoritesStore = useFavoritesStore((state) => state);

	const [activeView, setActiveView] = useState<GalleryViewId>("front");
	const [selectedVariation, setSelectedVariation] = useState(
		product.variations?.[0]?.name ?? null,
	);
	const [showReviews, setShowReviews] = useState(false);

	const isFavorite = favoritesStore.favorites.includes(product.id);
	const cartItem = cartStore.cart.find((item) => item.productId === product.id);
	const active = galleryViews.find((view) => view.id === activeView) ?? galleryViews[0];
	const stockLabel =
		product.stock <= 10 ? `${product.stock} left in stock` : "In stock";
	const similar = products.filter((item) => item.id !== product.id).slice(0, 6);

	return (
		<>
			<header className='fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-3'>
				<button
					type='button'
					aria-label='Go back'
					onClick={() => router.back()}
					className='flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition-transform active:scale-95'>
					<ChevronLeft className='size-5' />
				</button>
				<button
					type='button'
					aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
					aria-pressed={isFavorite}
					onClick={() => favoritesStore.toggleFavorite(product.id)}
					className='flex size-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-transform active:scale-95'>
					<Heart
						className={cn(
							"size-5 text-foreground transition-colors",
							isFavorite && "fill-danger text-danger",
						)}
					/>
				</button>
			</header>

			<section>
				<div className='relative flex h-[24rem] items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-background to-brand-200 sm:h-[30rem]'>
					{product.imageUrl ? (
						<Image
							src={product.imageUrl}
							alt={product.name}
							width={1200}
							height={1200}
							className='h-full w-full object-cover'
						/>
					) : (
						<div className='flex h-full w-full flex-col items-center justify-center gap-3 text-brand-700'>
							<active.icon className='size-24 drop-shadow-sm' />
							<p className='text-xs font-semibold uppercase tracking-[0.22em] text-brand-700/70'>
								{active.label} view
							</p>
							<p className='text-lg font-bold text-foreground'>
								{product.name}
							</p>
						</div>
					)}
				</div>
			</section>

			<Container>
				<div className='pb-24 pt-6 md:pb-28'>
					<div className='flex flex-wrap justify-center gap-2'>
						{galleryViews.map((view) => (
							<button
								key={view.id}
								type='button'
								aria-label={`Show ${view.label} view`}
								aria-pressed={activeView === view.id}
								onClick={() => setActiveView(view.id)}
								className={cn(
									"flex min-w-16 flex-col items-center gap-1 rounded-2xl border px-4 py-2 shadow-sm transition-all",
									activeView === view.id
										? "border-brand-400 bg-white ring-2 ring-brand-200"
										: "border-border bg-card hover:border-brand-200",
								)}>
								<view.icon
									className={cn(
										"size-5",
										activeView === view.id
											? "text-brand-600"
											: "text-muted-foreground",
									)}
								/>
								<span
									className={cn(
										"text-[10px] font-semibold uppercase tracking-[0.14em]",
										activeView === view.id
											? "text-brand-600"
											: "text-muted-foreground",
									)}>
									{view.label}
								</span>
							</button>
						))}
					</div>

					{(product.variations?.length ?? 0) > 0 ? (
						<section className='mt-8'>
							<h3 className='text-sm font-semibold'>Choose color</h3>
							<div className='mt-3 flex flex-wrap gap-2'>
								{product.variations!.map((variation) => {
									const selected = selectedVariation === variation.name;
									return (
										<button
											key={variation.name}
											type='button'
											aria-pressed={selected}
											onClick={() => setSelectedVariation(variation.name)}
											className={cn(
												"flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
												selected
													? "border-brand-400 bg-brand-50 text-brand-700"
													: "border-border bg-card hover:border-brand-200",
											)}>
											<span
												className='size-4 rounded-full ring-1 ring-black/10'
												style={{ backgroundColor: variation.color }}
											/>
											{variation.name}
										</button>
									);
								})}
							</div>
						</section>
					) : null}

					<div className='mt-6'>
						<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
							{product.name}
						</h1>

					<div className='mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm'>
						<span className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700'>
							<Star className='size-3.5 fill-amber-400 text-amber-400' />
							{product.rating.toFixed(1)}
						</span>
						<span className='text-muted-foreground'>
							({product.reviews} reviews)
						</span>
						<span className='h-1 w-1 rounded-full bg-border' />
						<span
							className={cn(
								"font-medium",
								product.stock <= 10 ? "text-danger" : "text-emerald-600",
							)}>
							{stockLabel}
						</span>
					</div>

					<div className='mt-4 flex items-end gap-3'>
						<span className='text-3xl font-extrabold tracking-tight text-primary'>
							{formatCurrency(product.price)}
						</span>
						{product.price > 200 ? (
							<span className='pb-1 text-sm text-muted-foreground line-through'>
								{formatCurrency(product.price * 1.15)}
							</span>
						) : null}
					</div>

					<p className='mt-4 leading-7 text-muted-foreground'>
						{product.description}
					</p>
					</div>

					{(product.features?.length ?? 0) > 0 ? (
						<section className='mt-8'>
							<h2 className='text-lg font-bold'>Features</h2>
							<ul className='mt-3 grid gap-2.5 sm:grid-cols-2'>
								{product.features!.map((feature) => (
									<li
										key={feature}
										className='flex items-center gap-2.5 rounded-xl border border-border/80 bg-card px-3 py-2.5 text-sm shadow-sm'>
										<span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600'>
											<Check className='size-3.5' />
										</span>
										{feature}
									</li>
								))}
							</ul>
						</section>
					) : null}

					<section className='mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card'>
						<button
							type='button'
							onClick={() => setShowReviews((value) => !value)}
							aria-expanded={showReviews}
							className='flex w-full items-center justify-between px-4 py-3.5'>
							<span className='flex items-center gap-2 text-sm font-semibold'>
								<MessageSquare className='size-4 text-brand-600' />
								Reviews
								<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium'>
									{product.reviews}
								</span>
							</span>
							<ChevronDown
								className={cn(
									"size-4 text-muted-foreground transition-transform duration-200",
									showReviews && "rotate-180",
								)}
							/>
						</button>
						{showReviews ? (
							<div className='space-y-3 border-t border-border px-4 pb-4 pt-4'>
								<div className='flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm'>
									<span className='font-medium'>Average rating</span>
									<span className='flex items-center gap-1 font-medium text-amber-700'>
										<Star className='size-3.5 fill-amber-400 text-amber-400' />
										{product.rating.toFixed(1)} / 5
									</span>
								</div>
								{demoReviews.map((review) => (
									<div
										key={review.id}
										className='rounded-xl bg-muted/40 p-3'>
										<div className='flex items-center justify-between'>
											<span className='text-sm font-medium'>
												{review.author}
											</span>
											<span className='flex items-center gap-1 text-xs font-medium text-amber-700'>
												<Star className='size-3 fill-amber-400 text-amber-400' />
												{review.rating}.0
											</span>
										</div>
										<p className='mt-1.5 text-sm text-muted-foreground'>
											{review.comment}
										</p>
									</div>
								))}
							</div>
						) : null}
					</section>

					<div className='mt-8 grid gap-3 sm:grid-cols-3'>
						<div className='rounded-2xl border border-border bg-card p-3'>
							<div className='flex items-center gap-2 text-sm font-medium'>
								<Truck className='size-4 text-brand-600' />
								Delivery
							</div>
							<p className='mt-2 text-xs text-muted-foreground'>
								Free shipping over $300
							</p>
						</div>
						<div className='rounded-2xl border border-border bg-card p-3'>
							<div className='flex items-center gap-2 text-sm font-medium'>
								<ShieldCheck className='size-4 text-emerald-600' />
								Warranty
							</div>
							<p className='mt-2 text-xs text-muted-foreground'>
								2-year manufacturer warranty
							</p>
						</div>
						<div className='rounded-2xl border border-border bg-card p-3'>
							<div className='flex items-center gap-2 text-sm font-medium'>
								<RotateCcw className='size-4 text-brand-600' />
								Returns
							</div>
							<p className='mt-2 text-xs text-muted-foreground'>
								Free 30-day returns
							</p>
						</div>
					</div>

					<section className='mt-10'>
						<div className='flex items-center justify-between'>
							<h2 className='text-lg font-bold'>Similar items</h2>
							<Link
								href='/shop'
								className='inline-flex items-center gap-0.5 text-sm font-medium text-primary'>
								See all
								<ChevronRight className='size-4' />
							</Link>
						</div>
						<div className='mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden'>
							{similar.map((item) => (
								<ProductCard
									key={item.id}
									product={item}
									className='w-[48%] shrink-0 snap-start sm:w-[30%] lg:w-[22%]'
								/>
							))}
						</div>
					</section>
				</div>
			</Container>

			<div className='fixed inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-border bg-card/95 px-4 py-4 shadow-lg backdrop-blur'>
				{cartItem ? (
					<div className='flex items-center justify-between gap-2'>
						<div className='flex items-center gap-1 rounded-full border border-border/80 p-1'>
							<Button
								variant='outline'
								size='icon'
								aria-label='Decrease quantity'
								disabled={cartItem.qty <= 1}
								onClick={() => cartStore.decreaseQty(product.id)}
								className='size-9 rounded-full'>
								<Minus className='size-4' />
							</Button>
							<span className='w-8 text-center text-base font-bold'>
								{cartItem.qty}
							</span>
							<Button
								variant='outline'
								size='icon'
								aria-label='Increase quantity'
								onClick={() => cartStore.increaseQty(product.id)}
								className='size-9 rounded-full'>
								<Plus className='size-4' />
							</Button>
						</div>
						<span className='pr-2 text-sm text-muted-foreground'>
							{formatCurrency(product.price * cartItem.qty)}
						</span>
					</div>
				) : (
					<Button
						className='w-full gap-2 rounded-full'
						onClick={() => cartStore.addToCart(product.id)}>
						<ShoppingBag className='size-4' />
						Add to cart
					</Button>
				)}
			</div>
		</>
	);
}