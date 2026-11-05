import { Suspense } from "react";
import { Container, EmptyState, Link, SearchInput, Skeleton } from "@/shared";
import { ProductCard } from "@/features/products";
import { Header } from "@/features/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { getCategories } from "@/features/content/server/content.service";
import { getProducts } from "@/features/products/server/products.service";
import { MAX_PRODUCT_PAGE_SIZE } from "@/features/products/lib/pagination";
import { isLowStock } from "@/features/products/lib/stock";

const tagMeta: Record<string, { label: string }> = {
	"limited-stock": { label: "Limited Stock" },
	"new-in-stock": { label: "New in stock" },
	bestsellers: { label: "Bestsellers" },
};

export default function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; tag?: string; category?: string }>;
}) {
	return (
		<Suspense fallback={<SearchResultsSkeleton />}>
			<SearchResults searchParams={searchParams} />
		</Suspense>
	);
}

function SearchResultsSkeleton() {
	return (
		<>
			<Header text='Shop results' />
			<section
				className='pb-24'
				aria-busy='true'
				aria-label='Loading products'>
				<Container>
					<Skeleton className='mt-2 h-4 w-28 rounded-full' />

					<div className='pt-2'>
						<Skeleton className='h-11 w-full rounded-full' />
					</div>

					<div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'>
						{Array.from({ length: 6 }).map((_, index) => (
							<div
								key={index}
								className='flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-2 shadow-sm'>
								<Skeleton className='aspect-square w-full rounded-xl' />
								<Skeleton className='h-4 w-3/4 rounded-full' />
								<Skeleton className='h-4 w-1/2 rounded-full' />
								<Skeleton className='mt-1 h-9 w-full rounded-md' />
							</div>
						))}
					</div>
				</Container>
			</section>
		</>
	);
}

async function SearchResults({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; tag?: string; category?: string }>;
}) {
	const { q, tag, category } = await searchParams;
	const query = q?.trim() ?? "";

	const meta = tag ? tagMeta[tag] : null;

	const categories = await getCategories();
	const activeCategory = category
		? categories.find(
				(item) => item.slug === category || item.label === category,
			)
		: undefined;

	const { products } = await getProducts({
		q: query || undefined,
		categoryId: activeCategory?.id,
		limit: MAX_PRODUCT_PAGE_SIZE,
	});

	const results = products.filter((product) => {
		if (tag === "limited-stock" && !isLowStock(product.stock)) return false;
		if (tag === "new-in-stock" && product.stock < 20) return false;
		if (tag === "bestsellers" && product.rating < 4.7) return false;
		if (activeCategory && product.category !== activeCategory.label)
			return false;
		return true;
	});

	const title = query
		? `Results for "${query}"`
		: activeCategory?.label || meta?.label || "Shop results";

	return (
		<>
			<Header text={title} number={String(results.length)} />
			<section className='pb-24'>
				<Container>
					<Link
						href='/shop'
						className='mt-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
						<ChevronLeft className='size-4' />
						Back to shop
					</Link>

					<div className='pt-2'>
						<SearchInput defaultValue={query} />
					</div>

					{results.length === 0 ? (
						<div className='mt-6'>
							<EmptyState
								icon={Search}
								title='No products found'
								description='Try a different search term or collection.'
								actionLabel='Back to shop'
								actionHref='/shop'
							/>
						</div>
					) : (
						<div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'>
							{results.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</Container>
			</section>
		</>
	);
}
