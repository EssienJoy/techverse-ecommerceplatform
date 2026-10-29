import { Suspense } from "react";
import {
	Brands,
	Categories,
	Deals,
	Hero,
	LimitedStock,
	ProductSections,
	RecentlyViewed,
	RecentlyViewedSkeleton,
	SearchBar,
} from "@/features/storefront";
import {
	getBrands,
	getCategories,
	getFlashSale,
	getHeroSlides,
} from "@/features/content";
import { getProducts } from "@/features/products/server/products.service";

export const metadata = { title: "Store Front" };

export default async function Home() {
	const [slides, categories, sale, brands, productPage] = await Promise.all([
		getHeroSlides(),
		getCategories(),
		getFlashSale(),
		getBrands(),
		getProducts(),
	]);

	const products = productPage.products;
	return (
		<>
			<SearchBar />
			<Hero slides={slides} />
			<Categories categories={categories} />
			<Deals sale={sale} />
			<Brands brands={brands} />
			<LimitedStock products={products} />
			<Suspense fallback={<RecentlyViewedSkeleton />}>
				<RecentlyViewed />
			</Suspense>
			<ProductSections categories={categories} products={products} />
		</>
	);
}
