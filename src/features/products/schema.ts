import { z } from "zod";

export const productVariationInputSchema = z.object({
	sku: z.string().min(1),
	color: z.string().min(1),
	size: z.string().min(1),
	price: z.number().int().nonnegative(),
	stock: z.number().int().nonnegative(),
	images: z.array(z.string().min(1)).default([]),
	features: z.array(z.string()).default([]),
});

export const productVariationSchema = productVariationInputSchema.extend({
	id: z.string().min(1),
});

export const productSchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	slug: z.string().min(1),
	description: z.string().min(1),
	// Summary values are derived from the product's variations.
	price: z.number().nonnegative(),
	imageUrl: z.string(),
	stock: z.number().int().nonnegative(),
	rating: z.number().min(0).max(5),
	reviews: z.number().int().nonnegative(),
	variations: z.array(productVariationSchema),
	category: z.string(),
	brand: z.string(),
});

export const productSummarySchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	price: z.number().nonnegative(),
	imageUrl: z.string().optional(),
	rating: z.number().min(0).max(5).optional(),
	reviews: z.number().int().nonnegative().optional(),
	stock: z.number().int().nonnegative().optional(),
	variations: z
		.array(
			z.object({
				id: z.string().min(1),
				sku: z.string().min(1),
				color: z.string().min(1),
				size: z.string().min(1),
				price: z.number().int().nonnegative(),
				stock: z.number().int().nonnegative(),
			}),
		)
		.optional(),
});

export const productInputSchema = z.object({
	name: z.string().min(1),
	slug: z.string().min(1),
	description: z.string().min(1),
	imageUrl: z.string().min(1),
	categoryId: z.string().min(1),
	brandId: z.string().min(1),
	isActive: z.boolean().optional(),
	variations: z.array(productVariationInputSchema).min(1),
});

export const productUpdateSchema = productInputSchema.partial();

export const productReviewInputSchema = z.object({
	productId: z.string().min(1),
	rating: z.coerce.number().int().min(1).max(5),
	reviewerName: z.string().trim().max(80).optional(),
	title: z.string().trim().max(120).optional(),
	body: z.string().trim().min(1).max(1000),
});

export const productReviewItemSchema = z.object({
	id: z.string().min(1),
	reviewerName: z.string().nullable(),
	title: z.string().nullable(),
	body: z.string(),
	createdAt: z.string(),
});

export type ProductVariation = z.infer<typeof productVariationSchema>;
export type ProductVariationInput = z.infer<typeof productVariationInputSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductSummary = z.infer<typeof productSummarySchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductReviewInput = z.infer<typeof productReviewInputSchema>;
export type ProductReviewItem = z.infer<typeof productReviewItemSchema>;
export type ProductFormValues = {
	id: string;
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	variations: ProductVariationInput[];
	categoryId: string;
	brandId: string;
	isActive: boolean;
};
