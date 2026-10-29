import "server-only";
import { prisma } from "@/prisma-client/prisma";
import { MAX_CART_LINES, MAX_QTY_PER_LINE } from "@/features/cart/lib/limits";
import { MAX_VIEWS_PER_OWNER } from "@/features/history/lib/limits";
import { clearGuestCookie, findGuestSession } from "./guest-session";

/**
 * Moves a guest's cart and browsing history into a user's account.
 *
 * Everything happens in one transaction: the guest session is claimed first
 * with a conditional update, so concurrent logins (or a replayed cookie) can
 * only ever claim it once. Either every item moves or nothing does.
 */

export type MergeResult = {
	merged: boolean;
	/** Cart lines that could not be carried over (sold out, unavailable, cart full). */
	dropped: number;
	/** Cart lines whose quantity was reduced to what is in stock. */
	adjusted: number;
};

const NOTHING: MergeResult = { merged: false, dropped: 0, adjusted: 0 };

/** Moves one guest session's cart and history into a user. No cookie access. */
export async function mergeGuestSessionIntoUser(
	guestSessionId: string,
	userId: string,
): Promise<MergeResult | null> {
	const guest = { id: guestSessionId };

	return prisma.$transaction(
		async (tx): Promise<MergeResult | null> => {
			const claimed = await tx.guestSession.updateMany({
				where: { id: guest.id, claimedAt: null },
				data: { claimedAt: new Date(), claimedByUserId: userId },
			});
			if (claimed.count === 0) return null;

			let dropped = 0;
			let adjusted = 0;

			// ---- Cart ----
			const guestCart = await tx.cart.findUnique({
				where: { guestSessionId: guest.id },
				include: { items: true },
			});

			if (guestCart && guestCart.items.length > 0) {
				const userCart = await tx.cart.upsert({
					where: { userId },
					create: { userId },
					update: {},
					include: { items: true },
				});

				const existingByKey = new Map(
					userCart.items.map((item) => [item.itemKey, item]),
				);

				const variationIds = guestCart.items.flatMap((item) =>
					item.variationId ? [item.variationId] : [],
				);
				const productIds = guestCart.items.flatMap((item) =>
					item.variationId ? [] : [item.productId],
				);

				const [variations, products] = await Promise.all([
					tx.variations.findMany({
						where: { id: { in: variationIds } },
						select: {
							id: true,
							stock: true,
							product: { select: { isActive: true } },
						},
					}),
					tx.product.findMany({
						where: { id: { in: productIds }, isActive: true },
						select: { id: true },
					}),
				]);
				const variationById = new Map(variations.map((v) => [v.id, v]));
				const activeProductIds = new Set(products.map((p) => p.id));

				let lineCount = userCart.items.length;
				const creates: {
					cartId: string;
					productId: string;
					variationId: string | null;
					itemKey: string;
					quantity: number;
				}[] = [];
				const updates: { id: string; quantity: number }[] = [];

				for (const item of guestCart.items) {
					let stock = Infinity;

					if (item.variationId) {
						const variation = variationById.get(item.variationId);
						if (!variation || !variation.product.isActive || variation.stock <= 0) {
							dropped++;
							continue;
						}
						stock = variation.stock;
					} else if (!activeProductIds.has(item.productId)) {
						dropped++;
						continue;
					}

					const cap = Math.min(MAX_QTY_PER_LINE, stock);
					const existing = existingByKey.get(item.itemKey);
					const wanted = (existing?.quantity ?? 0) + item.quantity;
					// Never reduce what the account already had; only limit what we add.
					const quantity = Math.max(existing?.quantity ?? 0, Math.min(wanted, cap));
					if (quantity < wanted) adjusted++;

					if (existing) {
						if (quantity !== existing.quantity) {
							updates.push({ id: existing.id, quantity });
						}
						continue;
					}

					if (lineCount >= MAX_CART_LINES) {
						dropped++;
						continue;
					}
					lineCount++;
					creates.push({
						cartId: userCart.id,
						productId: item.productId,
						variationId: item.variationId,
						itemKey: item.itemKey,
						quantity,
					});
				}

				if (creates.length > 0) {
					await tx.cartItem.createMany({ data: creates });
				}
				for (const update of updates) {
					await tx.cartItem.update({
						where: { id: update.id },
						data: { quantity: update.quantity },
					});
				}

				// Items cascade with the cart.
				await tx.cart.delete({ where: { id: guestCart.id } });
			}

			// ---- Browsing history ----
			const guestViews = await tx.productView.findMany({
				where: { guestSessionId: guest.id },
			});

			if (guestViews.length > 0) {
				const userViews = await tx.productView.findMany({
					where: {
						userId,
						productId: { in: guestViews.map((view) => view.productId) },
					},
				});
				const userViewByProduct = new Map(
					userViews.map((view) => [view.productId, view]),
				);

				const newViews: {
					userId: string;
					productId: string;
					viewCount: number;
					lastViewedAt: Date;
				}[] = [];

				for (const view of guestViews) {
					const existing = userViewByProduct.get(view.productId);

					if (!existing) {
						newViews.push({
							userId,
							productId: view.productId,
							viewCount: view.viewCount,
							lastViewedAt: view.lastViewedAt,
						});
						continue;
					}

					await tx.productView.update({
						where: { id: existing.id },
						data: {
							viewCount: existing.viewCount + view.viewCount,
							lastViewedAt:
								view.lastViewedAt > existing.lastViewedAt
									? view.lastViewedAt
									: existing.lastViewedAt,
						},
					});
				}

				if (newViews.length > 0) {
					await tx.productView.createMany({ data: newViews });
				}
				await tx.productView.deleteMany({ where: { guestSessionId: guest.id } });

				const stale = await tx.productView.findMany({
					where: { userId },
					orderBy: { lastViewedAt: "desc" },
					skip: MAX_VIEWS_PER_OWNER,
					select: { id: true },
				});
				if (stale.length > 0) {
					await tx.productView.deleteMany({
						where: { id: { in: stale.map(({ id }) => id) } },
					});
				}
			}

			return { merged: true, dropped, adjusted };
		},
		{ maxWait: 10_000, timeout: 20_000 },
	);
}

/** Merges the visitor's guest session (from their cookie) into a user. */
export async function mergeGuestActivityIntoUser(
	userId: string,
): Promise<MergeResult> {
	const guest = await findGuestSession();
	if (!guest) return NOTHING;

	const result = await mergeGuestSessionIntoUser(guest.id, userId);

	// The transaction committed (or the session was already claimed elsewhere):
	// either way this cookie is spent and must not be used again.
	await clearGuestCookie();

	return result ?? NOTHING;
}

/**
 * Same as above, but never throws. Signing in must not fail because a merge
 * did; on failure nothing is moved and the guest cookie stays for a retry.
 */
export async function claimGuestActivity(userId: string): Promise<MergeResult> {
	try {
		return await mergeGuestActivityIntoUser(userId);
	} catch (error) {
		console.error("Could not merge guest activity into the account.", error);
		return NOTHING;
	}
}
