import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/prisma-client/prisma";
import type { ShopperOwner } from "./customer-user";

const ownerWhere = (owner: ShopperOwner): Prisma.CartWhereUniqueInput =>
	owner.userId
		? { userId: owner.userId }
		: { guestSessionId: owner.guestSessionId };

const ownerData = (owner: ShopperOwner) =>
	owner.userId
		? { userId: owner.userId }
		: { guestSessionId: owner.guestSessionId };

export const isUniqueViolation = (error: unknown) =>
	error instanceof Prisma.PrismaClientKnownRequestError &&
	error.code === "P2002";

export function findCartLines(owner: ShopperOwner) {
	return prisma.cartItem.findMany({
		where: { cart: ownerWhere(owner) },
		select: { productId: true, variationId: true, quantity: true },
		orderBy: { createdAt: "asc" },
	});
}

/** One cart per owner: concurrent first requests converge on the same row. */
export async function getOrCreateCartId(owner: ShopperOwner): Promise<string> {
	try {
		const cart = await prisma.cart.upsert({
			where: ownerWhere(owner),
			create: ownerData(owner),
			update: {},
			select: { id: true },
		});
		return cart.id;
	} catch (error) {
		if (!isUniqueViolation(error)) throw error;

		const cart = await prisma.cart.findUniqueOrThrow({
			where: ownerWhere(owner),
			select: { id: true },
		});
		return cart.id;
	}
}

export function countCartLines(cartId: string) {
	return prisma.cartItem.count({ where: { cartId } });
}

export function cartLineExists(cartId: string, itemKey: string) {
	return prisma.cartItem
		.count({ where: { cartId, itemKey } })
		.then((count) => count > 0);
}

/** Atomic "add one unless already at the cap". Returns true if a row changed. */
export async function incrementLineBelowCap(
	cartId: string,
	itemKey: string,
	cap: number,
) {
	const result = await prisma.cartItem.updateMany({
		where: { cartId, itemKey, quantity: { lt: cap } },
		data: { quantity: { increment: 1 } },
	});
	return result.count > 0;
}

export function createCartLine(data: {
	cartId: string;
	productId: string;
	variationId?: string;
	itemKey: string;
}) {
	return prisma.cartItem.create({ data: { ...data, quantity: 1 } });
}

export async function setLineQuantity(
	owner: ShopperOwner,
	itemKey: string,
	quantity: number,
) {
	await prisma.cartItem.updateMany({
		where: { cart: ownerWhere(owner), itemKey },
		data: { quantity },
	});
}

export function deleteCartLine(owner: ShopperOwner, itemKey: string) {
	return prisma.cartItem.deleteMany({
		where: { cart: ownerWhere(owner), itemKey },
	});
}

export function clearCartLines(owner: ShopperOwner) {
	return prisma.cartItem.deleteMany({ where: { cart: ownerWhere(owner) } });
}

/** An active product (and, if given, one of its variations that is in stock). */
export async function findPurchasable(
	productId: string,
	variationId?: string,
): Promise<{ stock: number | null } | null> {
	if (!variationId) {
		const product = await prisma.product.findFirst({
			where: { id: productId, isActive: true },
			select: { id: true },
		});
		return product ? { stock: null } : null;
	}

	const variation = await prisma.variations.findFirst({
		where: {
			id: variationId,
			productId,
			stock: { gt: 0 },
			product: { isActive: true },
		},
		select: { stock: true },
	});
	return variation ? { stock: variation.stock } : null;
}

/** Current stock of a variation of a product, or null if it no longer exists. */
export async function findVariationStock(
	productId: string,
	variationId: string,
): Promise<number | null> {
	const variation = await prisma.variations.findFirst({
		where: { id: variationId, productId, product: { isActive: true } },
		select: { stock: true },
	});
	return variation ? variation.stock : null;
}
