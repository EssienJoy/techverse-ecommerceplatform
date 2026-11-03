import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail, ProductDetailSkeleton } from "@/features/products";
import { ProductViewTracker } from "@/features/history";
import {
	getProduct,
	getProductReviews,
} from "@/features/products/server/products.service";

export default function ProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	return (
		<Suspense fallback={<ProductDetailSkeleton />}>
			<ProductContent params={params} />
		</Suspense>
	);
}

async function ProductContent({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;
	const [product, reviews] = await Promise.all([
		getProduct(productId),
		getProductReviews(productId),
	]);

	if (!product) {
		notFound();
	}

	return (
		<>
			<ProductViewTracker productId={product.id} />
			<ProductDetail product={product} reviews={reviews} />
		</>
	);
}
