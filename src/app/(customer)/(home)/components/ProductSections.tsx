import { ProductCard } from "@/shared";
import { ProductSection } from "./ProductSection";
import { products } from "@/shared/data/products";

const sections = [
	{ title: "Featured", href: "/shop?section=featured" },
	{ title: "New Arrivals", href: "/shop?section=new-arrivals" },
	{ title: "Most Popular", href: "/shop?section=popular" },
	{ title: "Top Picks For You", href: "/shop?section=top-picks" },
	// { title: "Flash Sale", href: "/shop?section=flash-sale" },
	{ title: "Best Deals", href: "/shop?section=best-deals" },
];

export function ProductSections() {
	return (
		<>
			{sections.map(({ title, href }) => (
				<ProductSection key={title} title={title} href={href}>
					{products.slice(0, 10).map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							className='w-[50%] shrink-0 snap-start'
						/>
					))}
				</ProductSection>
			))}
		</>
	);
}
