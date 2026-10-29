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

export type ProductFormState = {
	fieldErrors?: Record<string, string[]>;
	formError?: string | null;
};

export async function createProductAction(
	_prevState: ProductFormState,
	formData: FormData,
): Promise<ProductFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const { parsed, imageFile, existingImageUrl, removeBackground } =
		parseProductForm(formData);

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const image = await resolveImageUrl(
		imageFile,
		existingImageUrl,
		removeBackground,
	);
	if (!image.ok) return { formError: image.error };

	try {
		await createProduct({ ...parsed.data, imageUrl: image.url });
	} catch {
		return {
			formError: "Could not save the product. Check the details and try again.",
		};
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
	if (access.status !== "success") return { formError: access.message };

	const id = String(formData.get("id") ?? "").trim();
	if (!id) return { formError: "Could not find the product to update." };

	const { parsed, imageFile, existingImageUrl, removeBackground } =
		parseProductForm(formData);

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const image = await resolveImageUrl(
		imageFile,
		existingImageUrl,
		removeBackground,
	);
	if (!image.ok) return { formError: image.error };

	try {
		await updateProduct(id, { ...parsed.data, imageUrl: image.url });
	} catch {
		return {
			formError: "Could not save the product. Check the details and try again.",
		};
	}

	revalidatePath("/admin/products");
	revalidatePath("/shop");
	revalidatePath("/");
	redirect("/admin/products?updated=1");
}

export async function deleteProductAction(id: string): Promise<void> {
	if ((await restrictTo(ADMIN_ROLES)).status !== "success") return;

	try {
		await deleteProduct(id);
	} catch {
		// ignored — revalidation refreshes the list regardless
	}

	revalidatePath("/admin/products");
	revalidatePath("/shop");
	revalidatePath("/");
}
