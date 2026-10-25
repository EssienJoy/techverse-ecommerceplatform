import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/prisma-client/prisma";

export async function findCategories() {
	"use cache";
	cacheTag("categories");
	cacheLife("default");

	return prisma.category.findMany({
		where: { isActive: true },
		orderBy: { sortOrder: "asc" },
	});
}

export async function findBrands() {
	"use cache";
	cacheTag("brands");
	cacheLife("default");

	return prisma.brand.findMany({
		where: { isActive: true },
		orderBy: { sortOrder: "asc" },
	});
}

export async function findHeroSlides() {
	"use cache";
	cacheTag("hero-slides");
	cacheLife("default");

	return prisma.heroSlide.findMany({
		where: { isActive: true },
		orderBy: { sortOrder: "asc" },
	});
}

export async function findActiveFlashSale(): Promise<{
	headline: string;
	endsAt: Date;
	isActive: boolean;
} | null> {
	"use cache";
	cacheTag("flash-sale");
	cacheLife("default");

	return null;
}

// Admin queries (uncached, include inactive)
export async function findAllCategories() {
	return prisma.category.findMany({
		orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
	});
}

export async function findAllBrands() {
	return prisma.brand.findMany({
		orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
	});
}

export async function findAllHeroSlides() {
	return prisma.heroSlide.findMany({
		orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
	});
}

export async function findLatestFlashSaleWithItems(): Promise<{
	id: string;
	headline: string;
	endsAt: Date;
	isActive: boolean;
	items: {
		id: string;
		productId: string;
		discount: number;
		product: {
			name: string;
			variations: { price: number }[];
		};
	}[];
} | null> {
	return null;
}

// Category mutations
export async function createCategoryRecord(data: {
	id: string;
	label: string;
	title: string | null;
	slug: string;
	icon: string;
	imageUrl: string | null;
	sortOrder: number;
}) {
	return prisma.category.create({
		data: { ...data, label: data.label.toLowerCase() },
	});
}

export async function updateCategoryRecord(
	id: string,
	data: {
		label?: string;
		title?: string | null;
		slug?: string;
		icon?: string;
		imageUrl?: string | null;
	},
) {
	return prisma.category.update({
		where: { id },
		data: {
			...data,
			...(data.label !== undefined
				? { label: data.label.toLowerCase() }
				: {}),
		},
	});
}

export async function deleteCategoryRecord(id: string) {
	return prisma.category.delete({ where: { id } });
}

// Brand mutations
export async function createBrandRecord(data: {
	id: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	sortOrder: number;
}) {
	return prisma.brand.create({
		data: { ...data, name: data.name.toLowerCase() },
	});
}

export async function updateBrandRecord(
	id: string,
	data: { name?: string; slug?: string; logoUrl?: string | null },
) {
	return prisma.brand.update({
		where: { id },
		data: {
			...data,
			...(data.name !== undefined ? { name: data.name.toLowerCase() } : {}),
		},
	});
}

export async function deleteBrandRecord(id: string) {
	return prisma.brand.delete({ where: { id } });
}

// Hero slide mutations
export async function createHeroSlideRecord(data: {
	tag: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	href: string;
	sortOrder: number;
	isActive: boolean;
}) {
	return prisma.heroSlide.create({ data });
}

export async function updateHeroSlideRecord(
	id: string,
	data: {
		tag?: string;
		title?: string;
		subtitle?: string;
		imageUrl?: string;
		href?: string;
		isActive?: boolean;
	},
) {
	return prisma.heroSlide.update({ where: { id }, data });
}

export async function deleteHeroSlideRecord(id: string) {
	return prisma.heroSlide.delete({ where: { id } });
}

// Flash sale mutations
export async function upsertFlashSaleRecord(data: {
	headline: string;
	endsAt: Date;
	isActive: boolean;
}) {
	void data;
	return null;
}

export async function createFlashSaleItemRecord(data: {
	flashSaleId: string;
	productId: string;
	discount: number;
}) {
	void data;
	return null;
}

export async function deleteFlashSaleItemRecord(id: string) {
	void id;
	return null;
}
