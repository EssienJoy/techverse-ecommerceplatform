import "server-only";

import {
	createProductRecord,
	findProducts,
	findProductById,
	findProductsByIds,
	findProductReviews,
	updateProductRecord,
	deleteProductRecord,
	createReviewRecord,
	countProducts,
} from "./products.repository";

import type {
	Product,
	ProductInput,
	ProductUpdateInput,
	ProductFormValues,
	ProductReviewInput,
	ProductReviewItem,
} from "@/shared/lib";
import { toProduct } from "../lib/utilities";

// COUNT PRODUCTS
export function getProductCount(): Promise<number> {
	return countProducts();
}

// GET ALL PRODUCTS
export async function getProducts(): Promise<Product[]> {
	const rows = await findProducts();

	return rows.map(toProduct);
}

// GET ONE PRODUCT FOR THE STOREFRONT
export async function getProduct(id: string): Promise<Product | null> {
	const row = await findProductById(id);

	return row ? toProduct(row) : null;
}

// GET MANY PRODUCTS BY IDS (cart, favorites)
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
	if (ids.length === 0) return [];

	const rows = await findProductsByIds(ids);

	return rows.map(toProduct);
}

// GET ONE PRODUCT FOR THE ADMIN EDIT FORM
export async function getProductForEdit(
	id: string,
): Promise<ProductFormValues | null> {
	const row = await findProductById(id);
	if (!row) return null;

	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		description: row.description,
		imageUrl: row.imageUrl,
		variations: row.variations.map((variation) => ({
			id: variation.id,
			sku: variation.sku,
			color: variation.color,
			size: variation.size,
			price: variation.price,
			stock: variation.stock,
			features: variation.features,
			images: variation.images.map((image) => image.url),
		})),
		categoryId: row.categoryId,
		brandId: row.brandId,
		isActive: row.isActive,
	};
}

// CREATE PRODUCT
export async function createProduct(input: ProductInput): Promise<Product> {
	const row = await createProductRecord(input);

	return toProduct(row);
}

// UPDATE PRODUCT
export async function updateProduct(
	id: string,
	input: ProductUpdateInput,
): Promise<Product> {
	const row = await updateProductRecord(id, input);

	return toProduct(row);
}

// DELETE PRODUCT
export async function deleteProduct(id: string): Promise<Product> {
	const row = await deleteProductRecord(id);

	return toProduct(row);
}

// GET PUBLISHED REVIEWS FOR A PRODUCT
export async function getProductReviews(
	productId: string,
): Promise<ProductReviewItem[]> {
	const rows = await findProductReviews(productId);

	return rows.map((row) => ({
		id: row.id,
		reviewerName: row.reviewerName,
		title: row.title,
		body: row.body,
		createdAt: row.createdAt.toISOString(),
	}));
}

// ADD A REVIEW AND ITS RATING
export async function addProductReview(
	input: ProductReviewInput,
): Promise<void> {
	await createReviewRecord({
		productId: input.productId,
		rating: input.rating,
		reviewerName: input.reviewerName ?? null,
		title: input.title ?? null,
		body: input.body,
	});
}
