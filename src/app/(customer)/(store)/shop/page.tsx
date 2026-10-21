import { Suspense } from "react";
import { ShopClient } from "./ShopClient";
import {
	getBrands,
	getCategories,
} from "@/features/content/server/content.service";
import { getProducts } from "@/features/products/server/products.service";
import { Header } from "@/features/navigation";

type ShopSearchParams = Promise<{ category?: string; brand?: string }>;

export default function ShopPage({
	searchParams,
}: {
	searchParams: ShopSearchParams;
}) {
	return (
		<Suspense fallback={<Header text='Shop' showBack={false} showSaved />}>
			<ShopContent searchParams={searchParams} />
		</Suspense>
	);
}

async function ShopContent({
	searchParams,
}: {
	searchParams: ShopSearchParams;
}) {
	const [{ category, brand }, categories, brands, products] = await Promise.all([
		searchParams,
		getCategories(),
		getBrands(),
		getProducts(),
	]);

	const matched = categories.find((item) => item.slug === category);

	const options = [
		{ id: "all", label: "All", slug: "", imageUrl: "" },
		...categories.map((item) => ({
			id: item.id,
			label: item.label,
			slug: item.slug,
			imageUrl: item.imageUrl ?? "",
		})),
	];

	return (
		<ShopClient
			products={products}
			categories={options}
			brands={brands.map((item) => ({ id: item.id, name: item.name }))}
			initialCategory={matched?.label ?? "All"}
			initialBrand={brand ?? ""}
		/>
	);
}
