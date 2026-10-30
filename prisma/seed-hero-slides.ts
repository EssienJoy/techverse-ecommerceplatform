import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Slides for the storefront hero carousel.
 *
 * The fixed ids make this script idempotent: running it again updates these
 * three slides instead of adding duplicates. Images come from Unsplash, which
 * is already allowed in `next.config.ts`.
 */
const heroSlides = [
	{
		id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
		tag: "New arrivals",
		title: "Laptops for work and play",
		subtitle:
			"Powerful machines from Apple, Asus and Lenovo, ready to ship today.",
		imageUrl:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80",
		href: "/shop/category/laptops",
		sortOrder: 0,
		isActive: true,
	},
	{
		id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
		tag: "Smartphones",
		title: "Upgrade the way you connect",
		subtitle:
			"The latest from Samsung, Oppo and Realme at TechNest prices.",
		imageUrl:
			"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
		href: "/shop/category/smartphones",
		sortOrder: 1,
		isActive: true,
	},
	{
		id: "c3d4e5f6-a7b8-4c9d-8e1f-2a3b4c5d6e7f",
		tag: "Audio",
		title: "Sound that moves with you",
		subtitle:
			"Headphones and earbuds built for commutes, workouts and everything between.",
		imageUrl:
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80",
		href: "/shop/category/audio",
		sortOrder: 2,
		isActive: true,
	},
];

async function main() {
	for (const slide of heroSlides) {
		await prisma.heroSlide.upsert({
			where: { id: slide.id },
			update: {
				tag: slide.tag,
				title: slide.title,
				subtitle: slide.subtitle,
				imageUrl: slide.imageUrl,
				href: slide.href,
				sortOrder: slide.sortOrder,
				isActive: slide.isActive,
			},
			create: slide,
		});
	}

	console.log(`Seeded ${heroSlides.length} hero slides.`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
