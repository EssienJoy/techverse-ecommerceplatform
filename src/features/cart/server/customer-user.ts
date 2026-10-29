import "server-only";
import { prisma } from "@/prisma-client/prisma";
import { getSession } from "@/features/auth/server/middleware/session";
import {
	findGuestSession,
	getOrCreateGuestSession,
} from "@/features/guest/server/guest-session";

async function findShopper() {
	const userId = await getSession();
	if (!userId) return null;

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true, isActive: true, role: true },
	});

	if (!user?.isActive) {
		throw new Error("Your account is inactive. Shopping changes were not saved.");
	}

	return user;
}

/**
 * Read access to a customer's saved items.
 * Returns null for guests and for admins (who have no saved items).
 */
export async function getActiveCustomerId(): Promise<string | null> {
	const user = await findShopper();
	return user?.role === "user" ? user.id : null;
}

/**
 * Write access to a customer's saved items.
 * Returns null for guests (their list stays in the browser) and throws for
 * admins, who can't save products.
 */
export async function requireShopperId(): Promise<string | null> {
	const user = await findShopper();
	if (!user) return null;

	if (user.role !== "user") {
		throw new Error("Admin accounts can't shop. Use a customer account.");
	}

	return user.id;
}

/**
 * Who owns the current visitor's cart and browsing history: a signed-in
 * customer, or an anonymous guest session. Exactly one of the two fields is
 * ever set, matching the database's ownership rule.
 */
export type ShopperOwner =
	| { userId: string; guestSessionId?: never }
	| { guestSessionId: string; userId?: never };

type ResolveOptions = {
	/** Create a guest session if the visitor has none (Server Actions only). */
	create: boolean;
	/** What to do for admins, who can't shop: refuse loudly, or just return null. */
	admin: "throw" | "none";
};

export async function resolveShopperOwner({
	create,
	admin,
}: ResolveOptions): Promise<ShopperOwner | null> {
	const user = await findShopper();

	if (user) {
		if (user.role === "user") return { userId: user.id };

		if (admin === "throw") {
			throw new Error("Admin accounts can't shop. Use a customer account.");
		}
		return null;
	}

	const guest = create
		? await getOrCreateGuestSession()
		: await findGuestSession();

	return guest ? { guestSessionId: guest.id } : null;
}
