import "server-only";
import { prisma } from "@/prisma-client/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const productInclude = {
	category: true,
	brand: true,
	variations: {
		orderBy: { sku: "asc" },
		include: { images: true },
	},
	ratings: { select: { value: true } },
	_count: { select: { reviews: true } },
} as const;

export type ProductRecord = Prisma.ProductGetPayload<{
	include: typeof productInclude;
}>;

import type { ProductInput, ProductUpdateInput } from "@/shared/lib";

function toVariationCreate(variations: ProductInput["variations"]) {
	return variations.map((variation) => ({
		sku: variation.sku,
		color: variation.color,
		size: variation.size,
		price: variation.price,
		stock: variation.stock,
		features: variation.features,
		images: { create: variation.images.map((url) => ({ url })) },
	}));
}

// GET ALL PRODUCTS
export async function findProducts() {
	return prisma.product.findMany({
		orderBy: { createdAt: "desc" },
		include: productInclude,
	});
}

// COUNT PRODUCTS
export function countProducts(): Promise<number> {
	return prisma.product.count();
}

// GET ONE PRODUCT
export async function findProductById(id: string) {
	return prisma.product.findUnique({
		where: { id },
		include: productInclude,
	});
}

// GET MANY PRODUCTS BY IDS (cart, favorites)
export async function findProductsByIds(ids: string[]) {
	if (ids.length === 0) return [];

	return prisma.product.findMany({
		where: { id: { in: ids } },
		include: productInclude,
	});
}

// CREATE PRODUCT
export async function createProductRecord(input: ProductInput) {
	const { categoryId, brandId, variations, ...data } = input;

	return prisma.product.create({
		data: {
			...data,
			category: { connect: { id: categoryId } },
			brand: { connect: { id: brandId } },
			variations: { create: toVariationCreate(variations) },
		},
		include: productInclude,
	});
}

// UPDATE PRODUCT
export async function updateProductRecord(
	id: string,
	input: ProductUpdateInput,
) {
	const { categoryId, brandId, variations, ...data } = input;

	return prisma.product.update({
		where: { id },
		data: {
			...data,

			category: categoryId ? { connect: { id: categoryId } } : undefined,
			brand: brandId ? { connect: { id: brandId } } : undefined,

			variations:
				variations === undefined
					? undefined
					: {
							deleteMany: {},
							create: toVariationCreate(variations),
						},
		},
		include: productInclude,
	});
}

// DELETE PRODUCT
export async function deleteProductRecord(id: string) {
	return prisma.product.delete({
		where: { id },
		include: productInclude,
	});
}

// GET PUBLISHED REVIEWS FOR A PRODUCT
export async function findProductReviews(productId: string) {
	return prisma.productReview.findMany({
		where: { productId, isPublished: true },
		orderBy: { createdAt: "desc" },
	});
}

// CREATE A REVIEW AND ITS RATING
export async function createReviewRecord(input: {
	productId: string;
	rating: number;
	reviewerName: string | null;
	title: string | null;
	body: string;
}) {
	return prisma.$transaction(async (tx) => {
		const review = await tx.productReview.create({
			data: {
				productId: input.productId,
				reviewerName: input.reviewerName,
				title: input.title,
				body: input.body,
				isPublished: true,
			},
		});

		await tx.productRating.create({
			data: { productId: input.productId, value: input.rating },
		});

		return review;
	});
}
