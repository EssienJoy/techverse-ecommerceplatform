import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/features/products";
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
		<Suspense
			fallback={
				<div className='flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground'>
					Loading product...
				</div>
			}>
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

	return <ProductDetail product={product} reviews={reviews} />;
}
