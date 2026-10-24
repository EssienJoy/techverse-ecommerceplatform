import "server-only";
import { prisma } from "@/prisma-client/prisma";
import { getSession } from "@/features/auth/server/middleware/session";

export async function getActiveCustomerId(): Promise<string | null> {
	const session = await getSession();
	if (!session) return null;

	const user = await prisma.user.findUnique({
		where: { id: session.id },
		select: { id: true, isActive: true },
	});

	if (!user?.isActive) {
		throw new Error("Your account is inactive. Shopping changes were not saved.");
	}

	return user.id;
}
