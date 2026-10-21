import { ProductCard } from "@/features/products";
import { ProductSection } from "./ProductSection";
import { getCategories } from "@/features/content/server/content.service";
import { getProducts } from "@/features/products/server/products.service";

export async function ProductSections() {
	const [categories, products] = await Promise.all([
		getCategories(),
		getProducts(),
	]);

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
						href={`/shop?category=${category.slug}`}>
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
