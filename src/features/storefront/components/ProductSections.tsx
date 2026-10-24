import { ProductCard } from "@/features/products";
import { ProductSection } from "./ProductSection";
import type { ContentCategory } from "@/features/content/lib/category";
import type { Product } from "@/shared/lib";

export function ProductSections({
	categories,
	products,
}: {
	categories: ContentCategory[];
	products: Product[];
}) {
	return (
		<>
			{categories.map((category) => {
				const items = products.filter(
					(product) => product.category === category.label,
				);

				if (items.length === 0) return null;

				return (
					<ProductSection
						key={category.id}
						title={category.title}
						href={`/shop/category/${category.slug}`}>
						{items.map((product) => (
							<ProductCard
								key={product.id}
								product={product}
								className='w-[50%] shrink-0 snap-start'
							/>
						))}
					</ProductSection>
				);
			})}
		</>
	);
}
