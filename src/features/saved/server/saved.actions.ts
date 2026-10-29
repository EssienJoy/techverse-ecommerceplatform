"use server";

import { z } from "zod";
import { prisma } from "@/prisma-client/prisma";
import {
	getActiveCustomerId,
	requireShopperId,
} from "@/features/cart/server/customer-user";

const productIdSchema = z.string().uuid();

export async function getSavedItemsAction(): Promise<string[] | null> {
	const userId = await getActiveCustomerId();
	if (!userId) return null;

	const savedItems = await prisma.savedItem.findMany({
		where: { saved: { userId } },
		select: { productId: true },
		orderBy: { createdAt: "asc" },
	});

	return savedItems.map(({ productId }) => productId);
}

export async function setSavedItemAction(
	productIdInput: string,
	isSaved: boolean,
): Promise<void> {
	const userId = await requireShopperId();
	if (!userId) return;

	const productId = productIdSchema.parse(productIdInput);
	const parsedIsSaved = z.boolean().parse(isSaved);

	if (!parsedIsSaved) {
		await prisma.savedItem.deleteMany({ where: { saved: { userId }, productId } });
		return;
	}

	const product = await prisma.product.findFirst({
		where: { id: productId, isActive: true },
		select: { id: true },
	});
	if (!product) {
		throw new Error("This product is unavailable.");
	}

	const saved = await prisma.saved.upsert({
		where: { userId },
		create: { userId },
		update: {},
		select: { id: true },
	});

	// Items are saved per product (variationId stays null), so the
	// (savedId, variationId) unique key can't be used for an upsert here.
	const existing = await prisma.savedItem.findFirst({
		where: { savedId: saved.id, productId },
		select: { id: true },
	});
	if (existing) return;

	await prisma.savedItem.create({
		data: { savedId: saved.id, productId },
	});
}

export async function clearSavedItemsAction(): Promise<void> {
	const userId = await requireShopperId();
	if (!userId) return;

	await prisma.savedItem.deleteMany({ where: { saved: { userId } } });
}
