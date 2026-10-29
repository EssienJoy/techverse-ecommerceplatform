import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrands } from "@/features/content/server/content.service";
import { isProductSort } from "@/features/products/lib/pagination";
import { CatalogContent } from "@/features/catalog";

type BrandParams = Promise<{ slug: string }>;
type BrandSearchParams = Promise<{
	category?: string;
	sort?: string;
	stock?: string;
}>;

export async function generateMetadata({
	params,
}: {
	params: BrandParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const brands = await getBrands();
	const brand = brands.find((item) => item.slug === slug);

	if (!brand) {
		return { title: "Brand not found" };
	}

	return {
		title: brand.name,
		description: `Shop ${brand.name} products at TechNest. Quality tech at great prices with fast delivery.`,
	};
}

export default async function BrandPage({
	params,
	searchParams,
}: {
	params: BrandParams;
	searchParams: BrandSearchParams;
}) {
	const { slug } = await params;
	const brands = await getBrands();

	if (!brands.some((brand) => brand.slug === slug)) {
		notFound();
	}

	return (
		<Suspense fallback={<div className='min-h-[50vh]' />}>
			<BrandContent slug={slug} searchParams={searchParams} />
		</Suspense>
	);
}

async function BrandContent({
	slug,
	searchParams,
}: {
	slug: string;
	searchParams: BrandSearchParams;
}) {
	const query = await searchParams;

	return (
		<CatalogContent
			mode='brand'
			brandSlug={slug}
			categorySlug={query.category}
			sort={isProductSort(query.sort) ? query.sort : "featured"}
			inStockOnly={query.stock === "1"}
		/>
	);
}
