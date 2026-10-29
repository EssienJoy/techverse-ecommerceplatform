import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/features/content/server/content.service";
import { isProductSort } from "@/features/products/lib/pagination";
import { CatalogContent } from "@/features/catalog";

type CategoryParams = Promise<{ slug: string }>;
type CategorySearchParams = Promise<{
	brand?: string;
	sort?: string;
	stock?: string;
}>;

export async function generateMetadata({
	params,
}: {
	params: CategoryParams;
}): Promise<Metadata> {
	const { slug } = await params;
	const categories = await getCategories();
	const category = categories.find((item) => item.slug === slug);

	if (!category) {
		return { title: "Category not found" };
	}

	return {
		title: category.title,
		description: `Shop ${category.label} at TechNest. Quality tech at great prices with fast delivery.`,
	};
}

export default async function CategoryPage({
	params,
	searchParams,
}: {
	params: CategoryParams;
	searchParams: CategorySearchParams;
}) {
	const { slug } = await params;
	const categories = await getCategories();

	if (!categories.some((category) => category.slug === slug)) {
		notFound();
	}

	return (
		<Suspense fallback={<div className='min-h-[50vh]' />}>
			<CategoryContent slug={slug} searchParams={searchParams} />
		</Suspense>
	);
}

async function CategoryContent({
	slug,
	searchParams,
}: {
	slug: string;
	searchParams: CategorySearchParams;
}) {
	const query = await searchParams;

	return (
		<CatalogContent
			mode='category'
			categorySlug={slug}
			brandSlug={query.brand}
			sort={isProductSort(query.sort) ? query.sort : "featured"}
			inStockOnly={query.stock === "1"}
		/>
	);
}
