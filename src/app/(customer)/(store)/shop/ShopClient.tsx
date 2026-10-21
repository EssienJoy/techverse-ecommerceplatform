"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
	ChevronDown,
	LayoutGrid,
	Search,
	SlidersHorizontal,
	Tag,
	X,
} from "lucide-react";
import { Container, EmptyState, SearchInput } from "@/shared";
import { ProductCard } from "@/features/products";
import type { Product } from "@/shared";
import { Header } from "@/features/navigation";
import { cn } from "cn";

const sortOptions = [
	{ label: "Featured", value: "featured" },
	{ label: "Price: Low to High", value: "price-asc" },
	{ label: "Price: High to Low", value: "price-desc" },
	{ label: "Top rated", value: "rating" },
];

const PAGE_SIZE = 20;
const DEFAULT_HERO_IMAGE = "/hero.jpg";

type ShopCategory = {
	id: string;
	label: string;
	slug: string;
	imageUrl: string;
};

type ShopBrand = {
	id: string;
	name: string;
};

type ShopClientProps = {
	products: Product[];
	categories: ShopCategory[];
	brands: ShopBrand[];
	initialCategory?: string;
	initialBrand?: string;
};

export function ShopClient({
	products,
	categories,
	brands,
	initialCategory = "All",
	initialBrand = "",
}: ShopClientProps) {
	const [category, setCategory] = useState(initialCategory);
	const [brand, setBrand] = useState(initialBrand);
	const [sort, setSort] = useState("featured");
	const [inStockOnly, setInStockOnly] = useState(false);
	const [visible, setVisible] = useState(PAGE_SIZE);

	const results = useMemo(() => {
		const list = products.filter((product) => {
			if (category !== "All" && product.category !== category) return false;
			if (brand && product.brand.toLowerCase() !== brand.toLowerCase()) {
				return false;
			}
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
	}, [products, category, brand, sort, inStockOnly]);

	const shown = results.slice(0, visible);
	const remaining = Math.max(results.length - visible, 0);

	const brandLabel = useMemo(() => {
		if (!brand) return "";

		return (
			products.find(
				(product) => product.brand.toLowerCase() === brand.toLowerCase(),
			)?.brand ?? brand
		);
	}, [products, brand]);

	const browsingAll = !brand && category === "All";
	const heroKind = browsingAll ? "Shop" : brand ? "Brand" : "Category";
	const heroTitle = browsingAll
		? "All products"
		: brand
			? brandLabel
			: category;

	const heroImage = useMemo(() => {
		if (brand) {
			const product = products.find(
				(item) => item.brand.toLowerCase() === brand.toLowerCase(),
			);

			return product?.imageUrl || DEFAULT_HERO_IMAGE;
		}

		const option = categories.find((item) => item.label === category);

		return option?.imageUrl || DEFAULT_HERO_IMAGE;
	}, [products, brand, categories, category]);

	const selectCategory = (label: string) => {
		setCategory(label);
		setBrand("");
		setVisible(PAGE_SIZE);
	};

	const selectBrand = (name: string) => {
		setBrand((current) =>
			current.toLowerCase() === name.toLowerCase() ? "" : name,
		);
		setCategory("All");
		setVisible(PAGE_SIZE);
	};

	const clearBrand = () => {
		setBrand("");
		setVisible(PAGE_SIZE);
	};

	return (
		<>
			<Header text='Shop' showBack={false} showSaved />

			<section className='pb-12'>
				<Container>
					<div className='pt-2'>
						<SearchInput />
					</div>
				</Container>

				<section className='relative my-6 h-52 w-full overflow-hidden sm:h-64'>
					<Image
						src={heroImage}
						alt={heroTitle}
						fill
						priority
						sizes='100vw'
						className='object-cover'
					/>
					<span className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10' />
					<Container className='relative flex h-full flex-col justify-end pb-6 text-white'>
						<p className='text-[10px] font-semibold tracking-[0.16em] text-white/75 uppercase'>
							{heroKind}
						</p>
						<h1
							className={cn(
								"mt-1 text-3xl font-bold sm:text-4xl",
								brand && "capitalize",
							)}>
							{heroTitle}
						</h1>
						<p className='mt-1 text-sm text-white/85'>
							{results.length} {results.length === 1 ? "product" : "products"}
						</p>

						{brand ? (
							<button
								type='button'
								onClick={clearBrand}
								className='mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/60 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white hover:text-foreground'>
								<X className='size-3.5' />
								Clear brand
							</button>
						) : null}
					</Container>
				</section>

				<Container>
					<section className='my-6'>
						<div className='flex items-center gap-2'>
							<LayoutGrid className='size-4 text-primary' />
							<h2 className='text-sm font-semibold text-foreground'>
								Browse by category
							</h2>
						</div>
						<div
							className='mt-3 flex gap-2 overflow-x-auto pb-2
						 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
							{categories.map((item) => {
								const selected = category === item.label;
								return (
									<button
										key={item.id}
										type='button'
										aria-pressed={selected}
										onClick={() => selectCategory(item.label)}
										className={cn(
											"shrink-0 rounded-full border border-primary px-4 py-1.5 text-sm font-medium transition-colors",
											selected
												? "bg-primary text-foreground-inverse"
												: "bg-transparent text-primary hover:bg-primary/10",
										)}>
										{item.label}
									</button>
								);
							})}
						</div>
					</section>

					{brands.length > 0 ? (
						<section className='my-6'>
							<div className='flex items-center gap-2'>
								<Tag className='size-4 text-primary' />
								<h2 className='text-sm font-semibold text-foreground'>
									Browse by brand
								</h2>
							</div>
							<div
								className='mt-3 flex gap-2 overflow-x-auto pb-2
							 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
								{brands.map((item) => {
									const selected =
										brand.toLowerCase() === item.name.toLowerCase();
									return (
										<button
											key={item.id}
											type='button'
											aria-pressed={selected}
											onClick={() => selectBrand(item.name)}
											className={cn(
												"shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
												selected
													? "border-primary bg-primary text-foreground-inverse"
													: "bg-transparent text-muted-foreground hover:border-primary hover:text-primary",
											)}>
											{item.name}
										</button>
									);
								})}
							</div>
						</section>
					) : null}

					<section className='my-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3'>
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
					</section>

					<div className='my-6'>
						<section className=' flex items-center justify-between'>
							<h2 className='text-lg font-bold text-foreground'>Products</h2>
							<p className='text-xs text-muted-foreground'>
								Showing {Math.min(visible, results.length)} of {results.length}
							</p>
						</section>

						{shown.length === 0 ? (
							<section>
								<EmptyState
									icon={Search}
									title='No products found'
									description='Try a different search term or category.'
									actionLabel='Clear filters'
									actionHref='/shop'
								/>
							</section>
						) : (
							<section
								className='my-6 grid grid-cols-2 gap-2
						 sm:grid-cols-3 xl:grid-cols-4'>
								{shown.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</section>
						)}
					</div>

					{remaining > 0 ? (
						<section className='flex flex-col items-center gap-2'>
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
						</section>
					) : null}
				</Container>
			</section>
		</>
	);
}
