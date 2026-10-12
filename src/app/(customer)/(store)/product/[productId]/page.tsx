import { products } from "@/app/(customer)/(store)/product";
import { notFound } from "next/navigation";
import { ProductDetail } from "../components";

export default async function ProductPage({
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