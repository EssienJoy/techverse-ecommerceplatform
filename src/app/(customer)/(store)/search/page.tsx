import { Suspense } from "react";
import { Container, EmptyState, Link, SearchInput } from "@/shared";
import { ProductCard } from "@/features/products";
import { Header } from "@/features/navigation";
import { ChevronLeft, Search } from "lucide-react";
import { getCategories } from "@/features/content/server/content.service";
import type { Product } from "@/shared/lib";

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
		<Suspense fallback={<Header text='Shop results' />}>
			<SearchResults searchParams={searchParams} />
		</Suspense>
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
	const products: Product[] = [];
	const activeCategory = category
		? categories.find(
				(item) => item.slug === category || item.label === category,
			)
		: undefined;

	const results = products.filter((product) => {
		if (tag === "limited-stock" && product.stock > 10) return false;
		if (tag === "new-in-stock" && product.stock < 20) return false;
		if (tag === "bestsellers" && product.rating < 4.7) return false;
		if (activeCategory && product.category !== activeCategory.label)
			return false;
		if (query && !product.name.toLowerCase().includes(query.toLowerCase()))
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
