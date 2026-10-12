"use client";

import { useMemo, useState } from "react";
import {
	ArrowRight,
	ChevronDown,
	Flame,
	LayoutGrid,
	Search,
	SlidersHorizontal,
	Sparkles,
	Check,
} from "lucide-react";
import { Container, EmptyState, ProductCard, SearchInput } from "@/shared";
import Link from "next/link";
import { products } from "../product";
import { Header } from "../_components";
import { cn } from "cn";

const shopCategories = [
	"All",
	"Phones",
	"Laptops",
	"Powerbanks",
	"Charger",
	"Cords",
	"Ear piece",
	"Headsets",
	"Tabs",
	"Computer",
	"Ear pods",
];

const banners = [
	{
		id: "limited-stock",
		tag: "Limited stock",
		title: "Grab them before they're gone",
		description: "Hot deals up to 30% off our bestsellers.",
		bg: "from-orange-500 to-red-500",
		icon: Flame,
	},
	{
		id: "new-in-stock",
		tag: "New in stock",
		title: "Fresh tech, just arrived",
		description: "The latest picks added to the collection this week.",
		bg: "from-brand-500 to-indigo-500",
		icon: Sparkles,
	},
];

const sortOptions = [
	{ label: "Featured", value: "featured" },
	{ label: "Price: Low to High", value: "price-asc" },
	{ label: "Price: High to Low", value: "price-desc" },
	{ label: "Top rated", value: "rating" },
];

const PAGE_SIZE = 20;

export default function ShopPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [category, setCategory] = useState("All");
	const [sort, setSort] = useState("featured");
	const [inStockOnly, setInStockOnly] = useState(false);
	const [visible, setVisible] = useState(PAGE_SIZE);

	const results = useMemo(() => {
		const list = products.filter((product) => {
			if (category !== "All" && product.category !== category) return false;
			if (inStockOnly && product.stock <= 0) return false;
			return true;
		});

		return list.sort((a, b) => {
			switch (sort) {
				case "price-asc":
					return a.price - b.price;
				case "price-desc":
					return b.price - a.price;
				case "rating":
					return b.rating - a.rating;
				default:
					return 0;
			}
		});
	}, [category, sort, inStockOnly]);

	const shown = results.slice(0, visible);
	const remaining = Math.max(results.length - visible, 0);

	const selectCategory = (label: string) => {
		setCategory(label);
		setMenuOpen(false);
		setVisible(PAGE_SIZE);
	};

	return (
		<>
			<Header
				text='Shop'
				showBack={false}
				showMenu
				onMenuClick={() => setMenuOpen((value) => !value)}
			/>

			{menuOpen ? (
				<section className='border-b border-border/60'>
					<Container className='pb-4'>
						<p className='mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
							Browse categories
						</p>
						<div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
							{shopCategories.map((label) => {
								const selected = category === label;
								return (
									<button
										key={label}
										type='button'
										aria-pressed={selected}
										onClick={() => selectCategory(label)}
										className={cn(
											"flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
											selected
												? "border-primary bg-primary/5 text-primary"
												: "border-border bg-card hover:border-primary/40",
										)}>
										{label}
										{selected ? <Check className='size-4' /> : null}
									</button>
								);
							})}
						</div>
					</Container>
				</section>
			) : null}

			<section className='pb-12'>
				<Container>
					<div className='pt-2'>
						<SearchInput />
					</div>

					<div className='mt-4 grid gap-3 sm:grid-cols-2'>
						{banners.map((banner) => (
							<Link
								key={banner.id}
								href={`/search?tag=${banner.id}`}
								className={cn(
									"group relative block overflow-hidden rounded-3xl border border-border bg-gradient-to-br p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5",
									banner.bg,
								)}>
								<banner.icon className='absolute -right-2 -top-2 size-16 text-white/15' />
								<span className='rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm'>
									{banner.tag}
								</span>
								<h2 className='mt-3 text-lg font-bold leading-tight'>
									{banner.title}
								</h2>
								<p className='mt-1 text-sm text-white/85'>
									{banner.description}
								</p>
								<span className='mt-3 inline-flex items-center gap-1 text-sm font-semibold'>
									Shop now
									<ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
								</span>
							</Link>
						))}
					</div>

					<div className='mt-5'>
						<div className='flex items-center gap-2'>
							<LayoutGrid className='size-4 text-primary' />
							<h2 className='text-sm font-semibold text-foreground'>
								Browse by category
							</h2>
						</div>
						<div className='mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
							{shopCategories.map((label) => {
								const selected = category === label;
								return (
									<button
										key={label}
										type='button'
										aria-pressed={selected}
										onClick={() => selectCategory(label)}
										className={cn(
											"shrink-0 rounded-full border border-primary px-4 py-1.5 text-sm font-medium transition-colors",
											selected
												? "bg-primary text-foreground-inverse"
												: "bg-transparent text-primary hover:bg-primary/10",
										)}>
										{label}
									</button>
								);
							})}
						</div>
					</div>

					<div className='mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3'>
						<div className='flex items-center gap-2'>
							<SlidersHorizontal className='size-4 text-muted-foreground' />
							<label className='sr-only' htmlFor='sort'>
								Sort products
							</label>
							<select
								id='sort'
								value={sort}
								onChange={(event) => setSort(event.target.value)}
								className='rounded-full border border-border bg-background px-3 py-2 text-sm font-medium outline-none focus-visible:border-ring'>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<button
							type='button'
							aria-pressed={inStockOnly}
							onClick={() => setInStockOnly((value) => !value)}
							className={cn(
								"rounded-full border px-3 py-2 text-sm font-medium transition-colors",
								inStockOnly
									? "border-primary bg-primary text-foreground-inverse"
									: "border-border bg-background text-muted-foreground hover:text-foreground",
							)}>
							In stock only
						</button>
					</div>

					<div className='mt-6 flex items-center justify-between'>
						<h2 className='text-lg font-bold text-foreground'>Products</h2>
						<p className='text-xs text-muted-foreground'>
							Showing {Math.min(visible, results.length)} of {results.length}
						</p>
					</div>

					{shown.length === 0 ? (
						<div className='mt-6'>
							<EmptyState
								icon={Search}
								title='No products found'
								description='Try a different search term or category.'
								actionLabel='Clear filters'
								actionHref='/shop'
							/>
						</div>
					) : (
						<div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'>
							{shown.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}

					{remaining > 0 ? (
						<div className='mt-8 flex flex-col items-center gap-2'>
							<button
								type='button'
								aria-label='Load more products'
								onClick={() => setVisible((value) => value + PAGE_SIZE)}
								className='flex size-11 items-center justify-center rounded-full border border-primary bg-background text-primary shadow-sm transition-colors hover:bg-primary hover:text-foreground-inverse active:translate-y-px'>
								<ChevronDown className='size-5' />
							</button>
							<span className='text-xs text-muted-foreground'>
								Load {Math.min(remaining, PAGE_SIZE)} more products
							</span>
						</div>
					) : null}
				</Container>
			</section>
		</>
	);
}