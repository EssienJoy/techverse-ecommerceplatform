"use server";

import { z } from "zod";
import { resolveShopperOwner } from "@/features/cart/server/customer-user";
import { recordProductView } from "./history.service";
import {
	actionSuccess,
	databaseError,
	type ActionOutcome,
} from "@/shared/lib/error";

const productIdSchema = z.string().uuid();

/** Records that the current visitor viewed a product. Admins are not tracked. */
export async function recordProductViewAction(
	productIdInput: string,
): Promise<ActionOutcome> {
	const productId = productIdSchema.safeParse(productIdInput);
	if (!productId.success) return actionSuccess();

	try {
		const owner = await resolveShopperOwner({ create: true, admin: "none" });
		if (!owner) return actionSuccess();

		await recordProductView(owner, productId.data);

		return actionSuccess();
	} catch (error) {
		return databaseError(error, "Could not record this product view.");
	}
}
