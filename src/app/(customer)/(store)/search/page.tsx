import { Container, EmptyState, Link, ProductCard, SearchInput } from "@/shared";
import { products } from "../product";
import { Header } from "../_components";
import { ChevronLeft, Search } from "lucide-react";

const tagMeta: Record<string, { label: string }> = {
	"limited-stock": { label: "Limited Stock" },
	"new-in-stock": { label: "New in stock" },
	bestsellers: { label: "Bestsellers" },
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ q?: string; tag?: string }>;
}) {
	const { q, tag } = await searchParams;
	const query = q?.trim() ?? "";

	const meta = tag ? tagMeta[tag] : null;

	const results = products.filter((product) => {
		if (tag === "limited-stock" && product.stock > 10) return false;
		if (tag === "new-in-stock" && product.stock < 20) return false;
		if (tag === "bestsellers" && product.rating < 4.7) return false;
		if (query && !product.name.toLowerCase().includes(query.toLowerCase()))
			return false;
		return true;
	});

	const title = query
		? `Results for "${query}"`
		: meta?.label ?? "Shop results";

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