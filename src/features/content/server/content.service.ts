import "server-only";
import { randomUUID } from "node:crypto";
import type { HeroSlide } from "../lib/banner";
import type { ContentBrand } from "../lib/brand";
import type { CategoryIconKey, ContentCategory } from "../lib/category";
import type { FlashSaleData } from "../lib/flash-sale";
import type { Product } from "@/features/products/schema";
import {
	ADMIN_ROLES,
	guard,
} from "@/features/auth/server/middleware/authorization";
import {
	findActiveFlashSale,
	findBrands,
	findCategories,
	findHeroSlides,
	findAllCategories,
	findAllBrands,
	findAllHeroSlides,
	findLatestFlashSaleWithItems,
	createCategoryRecord,
	updateCategoryRecord,
	deleteCategoryRecord,
	createBrandRecord,
	updateBrandRecord,
	deleteBrandRecord,
	createHeroSlideRecord,
	updateHeroSlideRecord,
	deleteHeroSlideRecord,
	upsertFlashSaleRecord,
	createFlashSaleItemRecord,
	deleteFlashSaleItemRecord,
} from "./content.repository";

function toSlug(value: string) {
	return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function toContentCategory(row: {
	id: string;
	label: string;
	title: string | null;
	slug: string;
	icon: string;
	imageUrl: string | null;
}): ContentCategory {
	return {
		id: row.id,
		label: row.label,
		title: row.title ?? row.label,
		slug: row.slug,
		icon: row.icon as CategoryIconKey,
		imageUrl: row.imageUrl ?? undefined,
	};
}

function toContentBrand(row: {
	id: string;
	name: string;
	slug: string;
	logoUrl: string | null;
}): ContentBrand {
	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		logoUrl: row.logoUrl ?? undefined,
	};
}

function toHeroSlide(row: {
	id: string;
	tag: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	href: string;
	isActive: boolean;
}): HeroSlide {
	return {
		id: row.id,
		tag: row.tag,
		title: row.title,
		subtitle: row.subtitle,
		imageUrl: row.imageUrl,
		href: row.href,
		active: row.isActive,
	};
}

// Storefront getters (cached, active only)
export async function getCategories(): Promise<ContentCategory[]> {
	const rows = await findCategories();
	return rows.map(toContentCategory);
}

export async function getBrands(): Promise<ContentBrand[]> {
	const rows = await findBrands();
	return rows.map(toContentBrand);
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
	const rows = await findHeroSlides();
	return rows.map(toHeroSlide);
}

export type FlashSaleDeal = {
	headline: string;
	endsAt: string;
	items: { product: Product; discount: number }[];
};

export async function getFlashSale(): Promise<FlashSaleDeal | null> {
	const sale = await findActiveFlashSale();
	if (!sale) {
		return null;
	}

	return {
		headline: sale.headline,
		endsAt: sale.endsAt.toISOString(),
		items: [],
	};
}

// Admin getters (uncached, include inactive)
export async function getAllCategories(): Promise<ContentCategory[]> {
	const access = await guard(ADMIN_ROLES);
	if (access.status !== "success") return [];

	const rows = await findAllCategories();
	return rows.map(toContentCategory);
}

export async function getAllBrands(): Promise<ContentBrand[]> {
	const access = await guard(ADMIN_ROLES);
	if (access.status !== "success") return [];

	const rows = await findAllBrands();
	return rows.map(toContentBrand);
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
	const access = await guard(ADMIN_ROLES);
	if (access.status !== "success") return [];

	const rows = await findAllHeroSlides();
	return rows.map(toHeroSlide);
}

export async function getFlashSaleAdmin(): Promise<FlashSaleData> {
	const access = await guard(ADMIN_ROLES);
	if (access.status !== "success") return null;

	const sale = await findLatestFlashSaleWithItems();
	if (!sale) return null;

	return {
		id: sale.id,
		headline: sale.headline,
		endsAt: sale.endsAt.toISOString(),
		isActive: sale.isActive,
		items: sale.items.map((item) => ({
			id: item.id,
			productId: item.productId,
			discount: item.discount,
			productName: item.product.name,
			productPrice: item.product.variations.length
				? Math.min(
						...item.product.variations.map((variation) => variation.price),
					)
				: 0,
		})),
	};
}

// Category mutations
export async function createCategory(input: {
	label: string;
	title?: string;
	icon: string;
	imageUrl?: string;
}): Promise<ContentCategory> {
	const label = input.label.toLowerCase();
	const slug = toSlug(label);
	const existing = await findAllCategories();
	const sortOrder =
		existing.reduce((max, c) => Math.max(max, c.sortOrder), -1) + 1;

	const row = await createCategoryRecord({
		id: randomUUID(),
		label,
		title: input.title || null,
		slug,
		icon: input.icon,
		imageUrl: input.imageUrl || null,
		sortOrder,
	});

	return toContentCategory(row);
}

export async function updateCategory(
	id: string,
	input: {
		label?: string;
		title?: string;
		icon?: string;
		imageUrl?: string;
	},
): Promise<ContentCategory> {
	const data: {
		label?: string;
		title?: string | null;
		slug?: string;
		icon?: string;
		imageUrl?: string | null;
	} = {};

	if (input.label !== undefined) {
		data.label = input.label.toLowerCase();
		data.slug = toSlug(input.label);
	}
	if (input.title !== undefined) data.title = input.title || null;
	if (input.icon !== undefined) data.icon = input.icon;
	if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl || null;

	const row = await updateCategoryRecord(id, data);
	return toContentCategory(row);
}

export async function deleteCategory(id: string): Promise<void> {
	await deleteCategoryRecord(id);
}

// Brand mutations
export async function createBrand(input: {
	name: string;
	logoUrl?: string;
}): Promise<ContentBrand> {
	const name = input.name.toLowerCase();
	const slug = toSlug(name);
	const existing = await findAllBrands();
	const sortOrder =
		existing.reduce((max, b) => Math.max(max, b.sortOrder), -1) + 1;

	const row = await createBrandRecord({
		id: randomUUID(),
		name,
		slug,
		logoUrl: input.logoUrl || null,
		sortOrder,
	});

	return toContentBrand(row);
}

export async function updateBrand(
	id: string,
	input: { name?: string; logoUrl?: string },
): Promise<ContentBrand> {
	const data: {
		name?: string;
		slug?: string;
		logoUrl?: string | null;
	} = {};

	if (input.name !== undefined) {
		data.name = input.name.toLowerCase();
		data.slug = toSlug(input.name);
	}
	if (input.logoUrl !== undefined) data.logoUrl = input.logoUrl || null;

	const row = await updateBrandRecord(id, data);
	return toContentBrand(row);
}

export async function deleteBrand(id: string): Promise<void> {
	await deleteBrandRecord(id);
}

// Hero slide mutations
export async function createHeroSlide(input: {
	tag: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	href: string;
	active: boolean;
}): Promise<HeroSlide> {
	const existing = await findAllHeroSlides();
	const sortOrder =
		existing.reduce((max, s) => Math.max(max, s.sortOrder), -1) + 1;

	const row = await createHeroSlideRecord({
		tag: input.tag,
		title: input.title,
		subtitle: input.subtitle,
		imageUrl: input.imageUrl,
		href: input.href,
		sortOrder,
		isActive: input.active,
	});

	return toHeroSlide(row);
}

export async function updateHeroSlide(
	id: string,
	input: {
		tag?: string;
		title?: string;
		subtitle?: string;
		imageUrl?: string;
		href?: string;
		active?: boolean;
	},
): Promise<HeroSlide> {
	const data: {
		tag?: string;
		title?: string;
		subtitle?: string;
		imageUrl?: string;
		href?: string;
		isActive?: boolean;
	} = {};

	if (input.tag !== undefined) data.tag = input.tag;
	if (input.title !== undefined) data.title = input.title;
	if (input.subtitle !== undefined) data.subtitle = input.subtitle;
	if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
	if (input.href !== undefined) data.href = input.href;
	if (input.active !== undefined) data.isActive = input.active;

	const row = await updateHeroSlideRecord(id, data);
	return toHeroSlide(row);
}

export async function deleteHeroSlide(id: string): Promise<void> {
	await deleteHeroSlideRecord(id);
}

// Flash sale mutations
export async function upsertFlashSale(input: {
	headline: string;
	endsAt: string;
	active: boolean;
}): Promise<void> {
	await upsertFlashSaleRecord({
		headline: input.headline,
		endsAt: new Date(input.endsAt),
		isActive: input.active,
	});
}

export async function addFlashSaleItem(input: {
	productId: string;
	discount: number;
}): Promise<void> {
	const sale = await findLatestFlashSaleWithItems();
	if (!sale) throw new Error("No flash sale found");

	await createFlashSaleItemRecord({
		flashSaleId: sale.id,
		productId: input.productId,
		discount: input.discount,
	});
}

export async function removeFlashSaleItem(id: string): Promise<void> {
	await deleteFlashSaleItemRecord(id);
}
