import { z } from "zod";

//user
export const userRoleSchema = z.enum(["user", "admin", "super_admin"]);

export const sessionUserSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	email: z.email(),
	role: userRoleSchema,
});

export const createUserInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

//hero slide
export const heroSlide = z.object({
	id: z.string(),
	tag: z.string(),
	title: z.string(),
	subtitle: z.string(),
	imageUrl: z.string(),
	href: z.string(),
	isActive: z.boolean(),
});

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

export const cartLineSchema = z.object({
	productId: z.string().min(1),
	variationId: z.string().min(1).optional(),
	qty: z.number().int().positive(),
});

export const cartItemSchema = z.object({
	productId: z.string().min(1),
	variationId: z.string().min(1).optional(),
	name: z.string().min(1),
	price: z.number().nonnegative(),
	imageUrl: z.string(),
	color: z.string().optional(),
	size: z.string().optional(),
	quantity: z.number().int().positive(),
});

export const cartSchema = z.array(cartLineSchema);

export const savedItemSchema = z.object({
	id: z.string().min(1),
	productId: z.string().min(1),
	name: z.string().min(1),
	price: z.number().nonnegative(),
	imageUrl: z.string().optional(),
});

export const shippingAddressSchema = z.object({
	fullName: z.string().min(1),
	email: z.email(),
	address: z.string().min(1),
	city: z.string().min(1),
	phone: z.string().min(1),
	postalCode: z.string().min(1),
});

export const orderItemSchema = z.object({
	productId: z.string().min(1),
	name: z.string().min(1),
	price: z.number().nonnegative(),
	qty: z.number().int().positive(),
});

export const orderShippingSchema = z.object({
	fullName: z.string().min(1),
	address: z.string().min(1),
	city: z.string().min(1),
	phone: z.string().min(1),
});

export const orderSchema = z.object({
	id: z.string().min(1),
	items: z.array(orderItemSchema).min(1),
	subtotal: z.number().nonnegative(),
	shipping: z.number().nonnegative(),
	tax: z.number().nonnegative(),
	total: z.number().nonnegative(),
	placedAt: z.iso.datetime(),
	shippingAddress: orderShippingSchema,
});

export const themeSchema = z.enum(["light", "dark", "system"]);

export const notificationKeySchema = z.enum([
	"orderUpdates",
	"promotions",
	"newsletter",
]);

export const notificationSettingsSchema = z.object({
	orderUpdates: z.boolean(),
	promotions: z.boolean(),
	newsletter: z.boolean(),
});

export const settingsSchema = z.object({
	theme: themeSchema,
	notifications: notificationSettingsSchema,
});

export function paginatedResponseSchema<T extends z.ZodType>(item: T) {
	return z.object({
		items: z.array(item),
		page: z.number().int().nonnegative(),
		pageSize: z.number().int().positive(),
		total: z.number().int().nonnegative(),
	});
}

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
export type UserRole = z.infer<typeof userRoleSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type CartLine = z.infer<typeof cartLineSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type SavedItem = z.infer<typeof savedItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderShipping = z.infer<typeof orderShippingSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type NotificationKey = z.infer<typeof notificationKeySchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
};
