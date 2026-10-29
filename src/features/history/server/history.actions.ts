"use server";

import { z } from "zod";
import { resolveShopperOwner } from "@/features/cart/server/customer-user";
import { recordProductView } from "./history.service";

const productIdSchema = z.string().uuid();

/** Records that the current visitor viewed a product. Admins are not tracked. */
export async function recordProductViewAction(
	productIdInput: string,
): Promise<void> {
	const productId = productIdSchema.safeParse(productIdInput);
	if (!productId.success) return;

	const owner = await resolveShopperOwner({ create: true, admin: "none" });
	if (!owner) return;

	await recordProductView(owner, productId.data);
}
