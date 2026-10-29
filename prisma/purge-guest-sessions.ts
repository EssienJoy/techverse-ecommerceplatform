import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// Deletes expired guest sessions, and sessions claimed more than 7 days ago
// (their cart and history were already moved to the account). Carts and
// product views of deleted sessions are removed with them.
//
// Run on a schedule (e.g. daily): npm run guests:purge

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CLAIMED_RETENTION_DAYS = 7;

async function main() {
	const claimedBefore = new Date(
		Date.now() - CLAIMED_RETENTION_DAYS * 24 * 60 * 60 * 1000,
	);

	const { count } = await prisma.guestSession.deleteMany({
		where: {
			OR: [{ expiresAt: { lt: new Date() } }, { claimedAt: { lt: claimedBefore } }],
		},
	});

	console.log(`Removed ${count} stale guest session(s).`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
