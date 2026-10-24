"use server";

import { z } from "zod";
import { prisma } from "@/prisma-client/prisma";
import { getActiveCustomerId } from "@/features/cart/server/customer-user";

const productIdSchema = z.string().uuid();

export async function getSavedItemsAction(): Promise<string[] | null> {
	const userId = await getActiveCustomerId();
	if (!userId) return null;

	const savedItems = await prisma.savedItem.findMany({
		where: { userId },
		select: { productId: true },
		orderBy: { createdAt: "asc" },
	});

	return savedItems.map(({ productId }) => productId);
}

export async function setSavedItemAction(
	productIdInput: string,
	isSaved: boolean,
): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	const productId = productIdSchema.parse(productIdInput);
	const parsedIsSaved = z.boolean().parse(isSaved);

	if (!parsedIsSaved) {
		await prisma.savedItem.deleteMany({ where: { userId, productId } });
		return;
	}

	const product = await prisma.product.findFirst({
		where: { id: productId, isActive: true },
		select: { id: true },
	});
	if (!product) {
		throw new Error("This product is unavailable.");
	}

	await prisma.savedItem.upsert({
		where: { userId_productId: { userId, productId } },
		create: { userId, productId },
		update: {},
	});
}

export async function clearSavedItemsAction(): Promise<void> {
	const userId = await getActiveCustomerId();
	if (!userId) return;

	await prisma.savedItem.deleteMany({ where: { userId } });
}
