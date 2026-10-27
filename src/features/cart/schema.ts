import { z } from "zod";

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

export type CartLine = z.infer<typeof cartLineSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
