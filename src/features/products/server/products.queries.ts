"use server";

import type { Product } from "@/shared/lib";
import { getProductsByIds } from "./products.service";

const MAX_IDS = 50;

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
	if (!Array.isArray(ids) || ids.length === 0) return [];

	const uniqueIds = Array.from(new Set(ids.filter(Boolean))).slice(0, MAX_IDS);

	return getProductsByIds(uniqueIds);
}
