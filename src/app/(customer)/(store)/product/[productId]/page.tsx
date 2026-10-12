import { Suspense } from "react";
import { products } from "@/app/(customer)/(store)/product";
import { notFound } from "next/navigation";
import { ProductDetail } from "../components";

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
	const product = products.find((item) => item.id === productId);

	if (!product) {
		notFound();
	}

	return <ProductDetail product={product} />;
}