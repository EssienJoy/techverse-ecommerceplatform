import "server-only";
import type { Product } from "@/features/products/schema";
import { getProductsByIds } from "@/features/products/server/products.service";
import type { ShopperOwner } from "@/features/cart/server/customer-user";
import {
	findActiveProductId,
	findRecentProductIds,
	pruneViews,
	recordView,
} from "./history.repository";

export async function recordProductView(
	owner: ShopperOwner,
	productId: string,
): Promise<void> {
	if (!(await findActiveProductId(productId))) return;

	const view = await recordView(owner, productId);
	// Only a brand-new product can push the list past its limit.
	if (view.viewCount === 1) await pruneViews(owner);
}

export async function getRecentlyViewed(
	owner: ShopperOwner | null,
	limit = 12,
): Promise<Product[]> {
	if (!owner) return [];

	const ids = await findRecentProductIds(owner, limit);
	if (ids.length === 0) return [];

	const products = await getProductsByIds(ids);
	const byId = new Map(products.map((product) => [product.id, product]));

	return ids.flatMap((id) => byId.get(id) ?? []);
}
