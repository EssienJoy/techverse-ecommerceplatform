import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	await prisma.variantImage.deleteMany();
	await prisma.variations.deleteMany();
	await prisma.product.deleteMany();
	await prisma.heroSlide.deleteMany();
	await prisma.brand.deleteMany();
	await prisma.category.deleteMany();
	await prisma.storeSetting.deleteMany();

	console.log(
		"Database cleared. All content is managed through the admin dashboard.",
	);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
