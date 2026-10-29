import { Suspense } from "react";
import type { Metadata } from "next";
import { isProductSort } from "@/features/products/lib/pagination";
import { CatalogContent } from "@/features/catalog";

export const metadata: Metadata = {
	title: "Shop",
	description:
		"Browse phones, laptops, audio, wearables and accessories at TechNest.",
};

type ShopSearchParams = Promise<{
	category?: string;
	brand?: string;
	sort?: string;
	stock?: string;
}>;

export default function ShopPage({
	searchParams,
}: {
	searchParams: ShopSearchParams;
}) {
	return (
		<Suspense fallback={<div className='min-h-[50vh]' />}>
			<ShopPageContent searchParams={searchParams} />
		</Suspense>
	);
}

async function ShopPageContent({
	searchParams,
}: {
	searchParams: ShopSearchParams;
}) {
	const params = await searchParams;

	return (
		<CatalogContent
			mode='all'
			categorySlug={params.category}
			brandSlug={params.brand}
			sort={isProductSort(params.sort) ? params.sort : "featured"}
			inStockOnly={params.stock === "1"}
		/>
	);
}
