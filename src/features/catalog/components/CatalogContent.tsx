import Link from "next/link";
import { notFound } from "next/navigation";
import {
	Check,
	ChevronDown,
	LayoutGrid,
	Search,
	SlidersHorizontal,
	Tag,
	X,
} from "lucide-react";
import { Container, EmptyState } from "@/shared";
import { cn } from "cn";
import {
	getBrands,
	getCategories,
} from "@/features/content/server/content.service";
import type { ContentBrand } from "@/features/content/lib/brand";
import type { ContentCategory } from "@/features/content/lib/category";
import { getProducts } from "@/features/products/server/products.service";
import {
	DEFAULT_PRODUCT_PAGE_SIZE,
	type ProductSort,
} from "@/features/products/lib/pagination";
import { CatalogBreadcrumb } from "./CatalogBreadcrumb";
import { ProductFeed } from "./ProductFeed";

const sortOptions: { label: string; value: ProductSort }[] = [
	{ label: "Featured", value: "featured" },
	{ label: "Best Selling", value: "best-selling" },
	{ label: "Price: Low to High", value: "price-asc" },
	{ label: "Price: High to Low", value: "price-desc" },
	{ label: "Top Rated", value: "rating" },
];

type ShopContentProps = {
	mode: "all" | "category" | "brand";
	categorySlug?: string | null;
	brandSlug?: string | null;
	sort: ProductSort;
	inStockOnly: boolean;
};

type ShopQuery = {
	category?: string | null;
	brand?: string | null;
	sort?: ProductSort;
	stock?: boolean;
};

function withQuery(path: string, query: ShopQuery) {
	const params = new URLSearchParams();

	if (query.category) params.set("category", query.category);
	if (query.brand) params.set("brand", query.brand);
	if (query.sort && query.sort !== "featured") params.set("sort", query.sort);
	if (query.stock) params.set("stock", "1");

	const search = params.toString();
	return search ? `${path}?${search}` : path;
}

function matchBrand(brands: ContentBrand[], value?: string | null) {
	if (!value) return null;

	const normalized = value.toLowerCase();

	return (
		brands.find(
			(brand) =>
				brand.slug === value || brand.name.toLowerCase() === normalized,
		) ?? null
	);
}

function matchCategory(categories: ContentCategory[], value?: string | null) {
	if (!value) return null;
	return categories.find((category) => category.slug === value) ?? null;
}

export async function CatalogContent({
	mode,
	categorySlug,
	brandSlug,
	sort,
	inStockOnly,
}: ShopContentProps) {
	const [categories, brands] = await Promise.all([
		getCategories(),
		getBrands(),
	]);

	const matchedCategory = matchCategory(categories, categorySlug);
	const matchedBrand = matchBrand(brands, brandSlug);

	if (mode === "category" && !matchedCategory) notFound();
	if (mode === "brand" && !matchedBrand) notFound();

	const page = await getProducts({
		limit: DEFAULT_PRODUCT_PAGE_SIZE,
		categoryId: matchedCategory?.id,
		brandId: matchedBrand?.id,
		sort,
		inStockOnly,
	});

	const currentPath =
		mode === "category" && matchedCategory
			? `/shop/category/${matchedCategory.slug}`
			: mode === "brand" && matchedBrand
				? `/shop/brand/${matchedBrand.slug}`
				: "/shop";

	const heroKind =
		mode === "category"
			? "Category"
			: mode === "brand"
				? "Brand"
				: matchedCategory
					? "Category"
					: matchedBrand
						? "Brand"
						: "Shop";

	const heroTitle =
		mode === "category"
			? (matchedCategory?.label ?? "Products")
			: mode === "brand"
				? (matchedBrand?.name ?? "Products")
				: (matchedCategory?.label ?? matchedBrand?.name ?? "All products");

	const activeSortLabel =
		sortOptions.find((option) => option.value === sort)?.label ?? "Featured";

	const categoryOptions = [
		{ label: "All", slug: null },
		...categories.map((item) => ({ label: item.label, slug: item.slug })),
	];

	const categoryHref = (slug: string | null) => {
		if (mode === "brand" && matchedBrand) {
			return withQuery(`/shop/brand/${matchedBrand.slug}`, {
				category: slug,
				sort,
				stock: inStockOnly,
			});
		}

		if (slug) {
			return withQuery(`/shop/category/${slug}`, {
				brand: matchedBrand?.slug,
				sort,
				stock: inStockOnly,
			});
		}

		if (matchedBrand) {
			return withQuery(`/shop/brand/${matchedBrand.slug}`, {
				sort,
				stock: inStockOnly,
			});
		}

		return withQuery("/shop", { sort, stock: inStockOnly });
	};

	const brandHref = (slug: string | null) => {
		if (mode === "category" && matchedCategory) {
			return withQuery(`/shop/category/${matchedCategory.slug}`, {
				brand: slug,
				sort,
				stock: inStockOnly,
			});
		}

		if (slug) {
			return withQuery(`/shop/brand/${slug}`, {
				category: matchedCategory?.slug,
				sort,
				stock: inStockOnly,
			});
		}

		if (matchedCategory) {
			return withQuery(`/shop/category/${matchedCategory.slug}`, {
				sort,
				stock: inStockOnly,
			});
		}

		return withQuery("/shop", { sort, stock: inStockOnly });
	};

	const filterHref = ({
		sort: nextSort = sort,
		stock = inStockOnly,
	}: {
		sort?: ProductSort;
		stock?: boolean;
	} = {}) => {
		if (mode === "category" && matchedCategory) {
			return withQuery(`/shop/category/${matchedCategory.slug}`, {
				brand: matchedBrand?.slug,
				sort: nextSort,
				stock,
			});
		}

		if (mode === "brand" && matchedBrand) {
			return withQuery(`/shop/brand/${matchedBrand.slug}`, {
				category: matchedCategory?.slug,
				sort: nextSort,
				stock,
			});
		}

		return withQuery("/shop", {
			category: matchedCategory?.slug,
			brand: matchedBrand?.slug,
			sort: nextSort,
			stock,
		});
	};

	const clearSecondaryHref = withQuery(currentPath, {
		sort,
		stock: inStockOnly,
	});

	return (
		<>
			<section className='relative my-4 w-full overflow-hidden bg-gradient-to-br from-zinc-950 via-neutral-900 to-black text-white'>
					<div className='pointer-events-none absolute -top-20 -right-10 size-56 rounded-full bg-white/10 blur-3xl' />
					<div className='pointer-events-none absolute -bottom-24 left-1/4 size-56 rounded-full bg-brand-500/20 blur-3xl' />
					<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)] [background-size:18px_18px]' />
					<span className='pointer-events-none absolute top-1/2 -right-4 hidden -translate-y-1/2 text-[7rem] font-black tracking-tighter text-white/5 uppercase select-none sm:block'>
						{heroKind}
					</span>

					<Container className='relative flex min-h-40 flex-col justify-end py-6 sm:min-h-48'>
						{mode !== "all" ? <CatalogBreadcrumb /> : null}
						<span className='inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase backdrop-blur'>
							<span className='size-1.5 rounded-full bg-brand-400' />
							{heroKind}
						</span>
						<h1
							className={cn(
								"mt-3 text-2xl font-bold tracking-tight sm:text-3xl",
								heroKind === "Brand" && "capitalize",
							)}>
							{heroTitle}
						</h1>
						<p className='mt-1 text-sm text-white/75'>
							{page.total} {page.total === 1 ? "product" : "products"}
						</p>

						{mode === "category" && matchedBrand ? (
							<Link
								href={clearSecondaryHref}
								aria-label={`Clear ${matchedBrand.name} brand filter`}
								className='mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium text-white capitalize backdrop-blur transition-colors hover:bg-white hover:text-foreground'>
								<X className='size-3.5' />
								{matchedBrand.name}
							</Link>
						) : mode === "brand" && matchedCategory ? (
							<Link
								href={clearSecondaryHref}
								aria-label={`Clear ${matchedCategory.label} category filter`}
								className='mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white hover:text-foreground'>
								<X className='size-3.5' />
								{matchedCategory.label}
							</Link>
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
						<div className='mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
							{categoryOptions.map((item) => {
								const selected = item.slug
									? matchedCategory?.slug === item.slug
									: !matchedCategory;

								return (
									<Link
										key={item.slug ?? "all"}
										href={categoryHref(item.slug)}
										aria-current={selected ? "page" : undefined}
										className={cn(
											"shrink-0 rounded-full border border-primary px-4 py-1.5 text-sm font-medium transition-colors",
											selected
												? "bg-primary text-foreground-inverse"
												: "bg-transparent text-primary hover:bg-primary/10",
										)}>
										{item.label}
									</Link>
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
							<div className='mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
								{brands.map((item) => {
									const selected = matchedBrand?.slug === item.slug;

									return (
										<Link
											key={item.id}
											href={brandHref(selected ? null : item.slug)}
											aria-current={selected ? "page" : undefined}
											className={cn(
												"shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
												selected
													? "border-primary bg-primary text-foreground-inverse"
													: "bg-transparent text-muted-foreground hover:border-primary hover:text-primary",
											)}>
											{item.name}
										</Link>
									);
								})}
							</div>
						</section>
					) : null}

					<section className='my-6 flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3'>
						<details className='group relative'>
							<summary className='flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 [&::-webkit-details-marker]:hidden'>
								<SlidersHorizontal className='size-4 text-muted-foreground' />
								<span>Filter: {activeSortLabel}</span>
								<ChevronDown className='size-3.5 text-muted-foreground transition-transform group-open:rotate-180' />
							</summary>
							<div className='absolute left-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg'>
								<p className='px-3 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
									Sort by
								</p>
								{sortOptions.map((option) => {
									const selected = sort === option.value;

									return (
										<Link
											key={option.value}
											href={filterHref({ sort: option.value })}
											aria-current={selected ? "page" : undefined}
											className={cn(
												"flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
												selected
													? "bg-primary/10 font-medium text-primary"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}>
											{option.label}
											{selected ? <Check className='size-4' /> : null}
										</Link>
									);
								})}
							</div>
						</details>

						<Link
							href={filterHref({ stock: !inStockOnly })}
							aria-current={inStockOnly ? "page" : undefined}
							className={cn(
								"rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
								inStockOnly
									? "border-primary bg-primary text-foreground-inverse"
									: "border-border bg-background text-muted-foreground hover:text-foreground",
							)}>
							In stock only
						</Link>
					</section>

					<section className='my-6'>
						{page.total === 0 ? (
							<>
								<section className='flex items-center justify-between'>
									<h2 className='text-lg font-bold text-foreground'>
										Products
									</h2>
									<p className='text-xs text-muted-foreground'>0 products</p>
								</section>
								<EmptyState
									icon={Search}
									title='No products found'
									description='Try a different category, brand, or filter.'
									actionLabel='Clear filters'
									actionHref={currentPath}
								/>
							</>
						) : (
							<ProductFeed
								key={`${matchedCategory?.id ?? "all"}|${matchedBrand?.id ?? "all"}|${sort}|${inStockOnly}`}
								initialProducts={page.products}
								initialNextCursor={page.nextCursor}
								initialTotal={page.total}
								filters={{
									categoryId: matchedCategory?.id,
									brandId: matchedBrand?.id,
									inStockOnly,
									sort,
								}}
							/>
						)}
					</section>
				</Container>
		</>
	);
}
