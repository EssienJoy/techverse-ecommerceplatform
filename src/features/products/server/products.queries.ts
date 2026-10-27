"use server";

import type { Product } from "../schema";
import { requireAdmin } from "@/features/auth/server/user.service";
import {
	getProducts,
	getProductsByIds,
	type ProductPage,
} from "./products.service";
import {
	isProductSort,
	normalizeProductPageSize,
	type ProductPageOptions,
} from "../lib/pagination";

const MAX_IDS = 50;

const emptyPage: ProductPage = {
	products: [],
	nextCursor: null,
	total: 0,
};

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
	if (!Array.isArray(ids) || ids.length === 0) return [];

	const uniqueIds = Array.from(new Set(ids.filter(Boolean))).slice(0, MAX_IDS);

	return getProductsByIds(uniqueIds);
}

export async function fetchProductsPage(
	options: ProductPageOptions = {},
): Promise<ProductPage> {
	if (!options || typeof options !== "object") return emptyPage;

	const includeInactive = options.includeInactive === true;

	if (includeInactive) {
		const access = await requireAdmin();
		if (!access.ok) return emptyPage;
	}

	return getProducts({
		...options,
		limit: normalizeProductPageSize(options.limit),
		sort: isProductSort(options.sort) ? options.sort : "featured",
		includeInactive,
	});
}
