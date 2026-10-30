import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Images for the category chips on the storefront home page.
 *
 * Each one is a product thumbnail already used elsewhere in the store, so the
 * chips match the catalogue and come from a host `next.config.ts` already
 * allows. Keyed by category slug so the script can be re-run safely; categories
 * that were renamed or removed are skipped by the `updateMany` below.
 */
const categoryImages: Record<string, string> = {
	smartphones:
		"https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
	laptops:
		"https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/thumbnail.webp",
	audio:
		"https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
	wearables:
		"https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
	tablets:
		"https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/thumbnail.webp",
};

async function main() {
	for (const [slug, imageUrl] of Object.entries(categoryImages)) {
		const { count } = await prisma.category.updateMany({
			where: { slug },
			data: { imageUrl },
		});

		console.log(
			count > 0 ? `Updated ${slug}.` : `Skipped ${slug} (no such category).`,
		);
	}
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
