"use server";

import { z } from "zod";
import { prisma } from "@/prisma-client/prisma";
import { getProductsByIds } from "@/features/products/server/products.service";
import { cartLineSchema } from "@/shared/lib";
import { getActiveCustomerId } from "./customer-user";

const productIdSchema = z.string().uuid();
const variationIdSchema = z.string().min(1);

function getItemKey(productId: string, variationId?: string): string {
	return variationId ?? productId;
}

export async function getCartAction(): Promise<{
	cart: z.infer<typeof cartLineSchema>[];
	products: Awaited<ReturnType<typeof getProductsByIds>>;
} | null> {
	const userId = await getActiveCustomerId();
	if (!userId) return null;

	const cartItems = await prisma.cartItem.findMany({
		where: { cart: { userId } },
		select: { productId: true, variationId: true, quantity: true },
		orderBy: { createdAt: "asc" },
	});

	const cart = cartItems.map(({ productId, variationId, quantity }) => ({
			productId,
			...(variationId ? { variationId } : {}),
			qty: quantity,
		}));
	const products = await getProductsByIds([
		...new Set(cartItems.map(({ productId }) => productId)),
	]);

	return { cart, products };
}

export async function addCartItemAction(
	productIdInput: string,
	variationIdInput?: string,
): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	const productId = productIdSchema.parse(productIdInput);
	const variationId = variationIdInput
		? variationIdSchema.parse(variationIdInput)
		: undefined;

	const product = await prisma.product.findFirst({
		where: {
			id: productId,
			isActive: true,
			...(variationId
				? { variations: { some: { id: variationId, stock: { gt: 0 } } } }
				: {}),
		},
		select: { id: true },
	});

	if (!product) {
		throw new Error("This product or variation is unavailable.");
	}

	const itemKey = getItemKey(productId, variationId);
	const cart = await prisma.cart.upsert({
		where: { userId },
		create: { userId },
		update: {},
		select: { id: true },
	});
	await prisma.cartItem.upsert({
		where: { cartId_itemKey: { cartId: cart.id, itemKey } },
		create: {
			cartId: cart.id,
			productId,
			variationId,
			itemKey,
			quantity: 1,
		},
		update: { quantity: { increment: 1 } },
	});
}

export async function setCartItemQuantityAction(
	productIdInput: string,
	variationIdInput: string | undefined,
	quantity: number,
): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	const productId = productIdSchema.parse(productIdInput);
	const variationId = variationIdInput
		? variationIdSchema.parse(variationIdInput)
		: undefined;
	const parsedQuantity = z.number().int().nonnegative().parse(quantity);
	const itemKey = getItemKey(productId, variationId);

	if (parsedQuantity === 0) {
		await prisma.cartItem.deleteMany({ where: { cart: { userId }, itemKey } });
		return;
	}

	await prisma.cartItem.updateMany({
		where: { cart: { userId }, itemKey },
		data: { quantity: parsedQuantity },
	});
}

export async function removeCartItemAction(
	productIdInput: string,
	variationIdInput?: string,
): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	const productId = productIdSchema.parse(productIdInput);
	const variationId = variationIdInput
		? variationIdSchema.parse(variationIdInput)
		: undefined;

	await prisma.cartItem.deleteMany({
		where: { cart: { userId }, itemKey: getItemKey(productId, variationId) },
	});
}

export async function clearCartAction(): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	await prisma.cartItem.deleteMany({ where: { cart: { userId } } });
}
