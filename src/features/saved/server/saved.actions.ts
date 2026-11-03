"use server";

import { z } from "zod";
import { prisma } from "@/prisma-client/prisma";
import {
	getActiveCustomerId,
	requireShopperId,
} from "@/features/cart/server/customer-user";
import {
	actionError,
	actionSuccess,
	databaseError,
	type ActionOutcome,
} from "@/shared/lib/error";

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
): Promise<ActionOutcome> {
	try {
		const userId = await requireShopperId();
		if (!userId) return actionSuccess();

		const productId = productIdSchema.parse(productIdInput);
		const parsedIsSaved = z.boolean().parse(isSaved);

		if (!parsedIsSaved) {
			await prisma.savedItem.deleteMany({
				where: { saved: { userId }, productId },
			});
			return actionSuccess();
		}

		const product = await prisma.product.findFirst({
			where: { id: productId, isActive: true },
			select: { id: true },
		});
		if (!product) {
			return actionError("This product is unavailable.");
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
		if (existing) return actionSuccess();

		await prisma.savedItem.create({
			data: { savedId: saved.id, productId },
		});

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not update your saved items.");
	}
}

export async function clearSavedItemsAction(): Promise<ActionOutcome> {
	try {
		const userId = await requireShopperId();
		if (!userId) return actionSuccess();

		await prisma.savedItem.deleteMany({ where: { saved: { userId } } });

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not clear your saved items.");
	}
}
