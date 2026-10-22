import { Suspense } from "react";
import {
	Brands,
	BrandsSkeleton,
	Categories,
	CategoriesSkeleton,
	Deals,
	DealsSkeleton,
	Hero,
	HeroSkeleton,
	LimitedStock,
	LimitedStockSkeleton,
	ProductSections,
	ProductSectionsSkeleton,
	SearchBar,
} from "@/features/storefront";
import {
	getBrands,
	getCategories,
	getFlashSale,
	getHeroSlides,
} from "@/features/content";
import { getProducts } from "@/features/products/server/products.service";

export default function Home() {
	return (
		<>
			<SearchBar />
			<Suspense fallback={<HomeSectionsSkeleton />}>
				<HomeSections />
			</Suspense>
		</>
	);
}

function HomeSectionsSkeleton() {
	return (
		<>
			<HeroSkeleton />
			<CategoriesSkeleton />
			<DealsSkeleton />
			<BrandsSkeleton />
			<LimitedStockSkeleton />
			<ProductSectionsSkeleton />
		</>
	);
}

async function HomeSections() {
	const [slides, categories, sale, brands, products] = await Promise.all([
		getHeroSlides(),
		getCategories(),
		getFlashSale(),
		getBrands(),
		getProducts(),
	]);

	return (
		<>
			<Hero slides={slides} />
			<Categories categories={categories} />
			<Deals sale={sale} />
			<Brands brands={brands} />
			<LimitedStock products={products} />
			<ProductSections categories={categories} products={products} />
		</>
	);
}
