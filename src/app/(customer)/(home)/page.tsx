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
	RecentlyViewed,
	RecentlyViewedSkeleton,
	SearchBar,
} from "@/features/storefront";

export default function Home() {
	return (
		<>
			<SearchBar />
			<Suspense fallback={<HeroSkeleton />}>
				<Hero />
			</Suspense>
			<Suspense fallback={<CategoriesSkeleton />}>
				<Categories />
			</Suspense>
			<Suspense fallback={<DealsSkeleton />}>
				<Deals />
			</Suspense>
			<Suspense fallback={<BrandsSkeleton />}>
				<Brands />
			</Suspense>
			<Suspense fallback={<LimitedStockSkeleton />}>
				<LimitedStock />
			</Suspense>
			<Suspense fallback={<RecentlyViewedSkeleton />}>
				<RecentlyViewed />
			</Suspense>
			<Suspense fallback={<ProductSectionsSkeleton />}>
				<ProductSections />
			</Suspense>
		</>
	);
}
