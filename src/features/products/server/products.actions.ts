"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
	ADMIN_ROLES,
	restrictTo,
} from "@/features/auth/server/middleware/authorization";
import {
	createProduct,
	updateProduct,
	deleteProduct,
} from "./products.service";
import { parseProductForm, resolveImageUrl } from "../lib/utilities";
import {
	actionError,
	actionSuccess,
	databaseError,
	validationError,
	type ActionResult,
} from "@/shared/lib/error";

export type ProductFormState = ActionResult;

export async function createProductAction(
	_prevState: ProductFormState,
	formData: FormData,
): Promise<ProductFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}

	const { parsed, imageFile, existingImageUrl, removeBackground } =
		parseProductForm(formData);

	if (!parsed.success) {
		return validationError(parsed.error.flatten().fieldErrors);
	}

	const image = await resolveImageUrl(
		imageFile,
		existingImageUrl,
		removeBackground,
	);
	if (!image.ok) return actionError(image.error);

	try {
		await createProduct({ ...parsed.data, imageUrl: image.url });
	} catch (error) {
		return databaseError(
			error,
			"Could not save the product. Check the details and try again.",
		);
	}

	revalidatePath("/admin/products");
	revalidatePath("/shop");
	revalidatePath("/");
	redirect("/admin/products?created=1");
}

export async function updateProductAction(
	_prevState: ProductFormState,
	formData: FormData,
): Promise<ProductFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}

	const id = String(formData.get("id") ?? "").trim();
	if (!id) return actionError("Could not find the product to update.");

	const { parsed, imageFile, existingImageUrl, removeBackground } =
		parseProductForm(formData);

	if (!parsed.success) {
		return validationError(parsed.error.flatten().fieldErrors);
	}

	const image = await resolveImageUrl(
		imageFile,
		existingImageUrl,
		removeBackground,
	);
	if (!image.ok) return actionError(image.error);

	try {
		await updateProduct(id, { ...parsed.data, imageUrl: image.url });
	} catch (error) {
		return databaseError(
			error,
			"Could not save the product. Check the details and try again.",
		);
	}

	revalidatePath("/admin/products");
	revalidatePath("/shop");
	revalidatePath("/");
	redirect("/admin/products?updated=1");
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}

	try {
		await deleteProduct(id);
	} catch (error) {
		return databaseError(error, "Could not delete the product. Try again.");
	}

	revalidatePath("/admin/products");
	revalidatePath("/shop");
	revalidatePath("/");
	return actionSuccess();
}
