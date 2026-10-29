import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/prisma-client/prisma";
import type { ShopperOwner } from "@/features/cart/server/customer-user";
import { MAX_VIEWS_PER_OWNER } from "../lib/limits";

const viewOwner = (owner: ShopperOwner) =>
	owner.userId
		? { userId: owner.userId }
		: { guestSessionId: owner.guestSessionId };

const viewKey = (
	owner: ShopperOwner,
	productId: string,
): Prisma.ProductViewWhereUniqueInput =>
	owner.userId !== undefined
		? { userId_productId: { userId: owner.userId, productId } }
		: {
				guestSessionId_productId: {
					guestSessionId: owner.guestSessionId,
					productId,
				},
			};

export async function findActiveProductId(productId: string) {
	const product = await prisma.product.findFirst({
		where: { id: productId, isActive: true },
		select: { id: true },
	});
	return product?.id ?? null;
}

/** Creates the view or bumps it, so a product appears once per owner. */
export async function recordView(owner: ShopperOwner, productId: string) {
	const now = new Date();
	try {
		return await prisma.productView.upsert({
			where: viewKey(owner, productId),
			create: { ...viewOwner(owner), productId, lastViewedAt: now },
			update: { viewCount: { increment: 1 }, lastViewedAt: now },
			select: { viewCount: true },
		});
	} catch (error) {
		if (
			!(error instanceof Prisma.PrismaClientKnownRequestError) ||
			error.code !== "P2002"
		) {
			throw error;
		}

		// A concurrent request created it first; just bump it.
		await prisma.productView.updateMany({
			where: { ...viewOwner(owner), productId },
			data: { viewCount: { increment: 1 }, lastViewedAt: now },
		});
		return { viewCount: 2 };
	}
}

/** Deletes everything beyond the newest MAX_VIEWS_PER_OWNER views. */
export async function pruneViews(owner: ShopperOwner) {
	const stale = await prisma.productView.findMany({
		where: viewOwner(owner),
		orderBy: { lastViewedAt: "desc" },
		skip: MAX_VIEWS_PER_OWNER,
		select: { id: true },
	});
	if (stale.length === 0) return;

	await prisma.productView.deleteMany({
		where: { id: { in: stale.map(({ id }) => id) } },
	});
}

/** Product ids, most recently viewed first, for products still on sale. */
export async function findRecentProductIds(owner: ShopperOwner, limit: number) {
	const rows = await prisma.productView.findMany({
		where: { ...viewOwner(owner), product: { isActive: true } },
		orderBy: { lastViewedAt: "desc" },
		take: limit,
		select: { productId: true },
	});
	return rows.map(({ productId }) => productId);
}
