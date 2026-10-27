import { z } from "zod";

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

export type OrderItem = z.infer<typeof orderItemSchema>;
export type OrderShipping = z.infer<typeof orderShippingSchema>;
export type Order = z.infer<typeof orderSchema>;
