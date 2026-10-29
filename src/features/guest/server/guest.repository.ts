import "server-only";
import { prisma } from "@/prisma-client/prisma";

export function findActiveGuestSessionByHash(tokenHash: string) {
	return prisma.guestSession.findFirst({
		where: { tokenHash, claimedAt: null, expiresAt: { gt: new Date() } },
	});
}

export function createGuestSessionRecord(data: {
	tokenHash: string;
	expiresAt: Date;
}) {
	return prisma.guestSession.create({ data });
}

export function renewGuestSessionRecord(id: string, expiresAt: Date) {
	return prisma.guestSession.update({
		where: { id },
		data: { lastSeenAt: new Date(), expiresAt },
	});
}
