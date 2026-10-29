"use server";

import { revalidatePath, updateTag } from "next/cache";
import { resolveImageUpload } from "@/shared/lib/uploads";
import {
	ADMIN_ROLES,
	restrictTo,
} from "@/features/auth/server/middleware/authorization";
import {
	createCategory,
	updateCategory,
	deleteCategory,
	createBrand,
	updateBrand,
	deleteBrand,
	createHeroSlide,
	updateHeroSlide,
	deleteHeroSlide,
	upsertFlashSale,
	addFlashSaleItem,
	removeFlashSaleItem,
} from "./content.service";

export type ContentFormState = {
	fieldErrors?: Record<string, string[]>;
	formError?: string | null;
	success?: boolean;
};

function str(value: FormDataEntryValue | null): string {
	return typeof value === "string" ? value.trim() : "";
}

// Storefront/admin pages that fetch products and cached content (categories,
// brands, hero), so image/content changes are reflected.
function revalidateContentConsumers() {
	revalidatePath("/");
	revalidatePath("/shop");
	revalidatePath("/search");
	revalidatePath("/admin/products/new");
}

// Pages that fetch categories or brands directly.
function revalidateCategoryConsumers() {
	revalidateContentConsumers();
	revalidatePath("/admin/content");
	revalidatePath("/admin/content/categories");
	revalidatePath("/admin/products/[id]/edit", "page");
}

function revalidateBrandConsumers() {
	revalidateContentConsumers();
	revalidatePath("/admin/content");
	revalidatePath("/admin/content/brands");
	revalidatePath("/admin/products/[id]/edit", "page");
}

// Category actions
export async function categoryFormAction(
	_prevState: ContentFormState,
	formData: FormData,
): Promise<ContentFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const id = str(formData.get("id"));
	const label = str(formData.get("label"));
	const title = str(formData.get("title"));
	const icon = str(formData.get("icon"));

	const fieldErrors: Record<string, string[]> = {};
	if (!label) fieldErrors.label = ["Name is required"];
	if (!icon) fieldErrors.icon = ["Icon is required"];
	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	const image = await resolveImageUpload(formData);
	if (!image.ok) return { formError: image.error };

	try {
		if (id) {
			await updateCategory(id, { label, title, icon, imageUrl: image.url });
		} else {
			await createCategory({ label, title, icon, imageUrl: image.url });
		}
	} catch {
		return { formError: "Could not save the category. Try again." };
	}

	updateTag("categories");
	revalidateCategoryConsumers();
	return { success: true };
}

export async function deleteCategoryAction(id: string): Promise<void> {
	if ((await restrictTo(ADMIN_ROLES)).status !== "success") return;

	try {
		await deleteCategory(id);
	} catch {
		// ignored — revalidation refreshes the list regardless
	}
	updateTag("categories");
	revalidateCategoryConsumers();
}

// Brand actions
export async function brandFormAction(
	_prevState: ContentFormState,
	formData: FormData,
): Promise<ContentFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const id = str(formData.get("id"));
	const name = str(formData.get("name"));

	const fieldErrors: Record<string, string[]> = {};
	if (!name) fieldErrors.name = ["Name is required"];
	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	const image = await resolveImageUpload(formData, "logoUrl");
	if (!image.ok) return { formError: image.error };

	try {
		if (id) {
			await updateBrand(id, { name, logoUrl: image.url });
		} else {
			await createBrand({ name, logoUrl: image.url || undefined });
		}
	} catch {
		return { formError: "Could not save the brand. Try again." };
	}

	updateTag("brands");
	revalidateBrandConsumers();
	return { success: true };
}

export async function deleteBrandAction(id: string): Promise<void> {
	if ((await restrictTo(ADMIN_ROLES)).status !== "success") return;

	try {
		await deleteBrand(id);
	} catch {
		// ignored
	}
	updateTag("brands");
	revalidateBrandConsumers();
}

// Hero slide actions
export async function heroFormAction(
	_prevState: ContentFormState,
	formData: FormData,
): Promise<ContentFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const id = str(formData.get("id"));
	const tag = str(formData.get("tag"));
	const title = str(formData.get("title"));
	const subtitle = str(formData.get("subtitle"));
	const href = str(formData.get("href"));
	const active = formData.get("active") === "on";

	const fieldErrors: Record<string, string[]> = {};
	if (!title) fieldErrors.title = ["Title is required"];
	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	const image = await resolveImageUpload(formData);
	if (!image.ok) return { formError: image.error };

	try {
		if (id) {
			await updateHeroSlide(id, {
				tag,
				title,
				subtitle,
				imageUrl: image.url,
				href,
				active,
			});
		} else {
			await createHeroSlide({
				tag,
				title,
				subtitle,
				imageUrl: image.url,
				href,
				active,
			});
		}
	} catch {
		return { formError: "Could not save the slide. Try again." };
	}

	updateTag("hero-slides");
	revalidatePath("/admin/content/hero");
	revalidateContentConsumers();
	return { success: true };
}

export async function deleteHeroAction(id: string): Promise<void> {
	if ((await restrictTo(ADMIN_ROLES)).status !== "success") return;

	try {
		await deleteHeroSlide(id);
	} catch {
		// ignored
	}
	updateTag("hero-slides");
	revalidatePath("/admin/content/hero");
	revalidateContentConsumers();
}

// Flash sale actions
export async function flashSaleSettingsAction(
	_prevState: ContentFormState,
	formData: FormData,
): Promise<ContentFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const headline = str(formData.get("headline"));
	const endsAt = str(formData.get("endsAt"));
	const active = formData.get("active") === "on";

	const fieldErrors: Record<string, string[]> = {};
	if (!headline) fieldErrors.headline = ["Headline is required"];
	if (!endsAt) fieldErrors.endsAt = ["End date is required"];
	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	try {
		await upsertFlashSale({ headline, endsAt, active });
	} catch {
		return { formError: "Could not save the flash sale. Try again." };
	}

	updateTag("flash-sale");
	revalidatePath("/admin/content/flash-sale");
	return { success: true };
}

export async function addFlashSaleItemAction(
	_prevState: ContentFormState,
	formData: FormData,
): Promise<ContentFormState> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { formError: access.message };

	const productId = str(formData.get("productId"));
	const discount = Number(str(formData.get("discount")));

	const fieldErrors: Record<string, string[]> = {};
	if (!productId) fieldErrors.productId = ["Product is required"];
	if (!discount || discount <= 0 || discount > 90) {
		fieldErrors.discount = ["Discount must be between 1 and 90"];
	}
	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	try {
		await addFlashSaleItem({ productId, discount });
	} catch {
		return { formError: "Could not add the item. Try again." };
	}

	updateTag("flash-sale");
	revalidatePath("/admin/content/flash-sale");
	return { success: true };
}

export async function deleteFlashSaleItemAction(id: string): Promise<void> {
	if ((await restrictTo(ADMIN_ROLES)).status !== "success") return;

	try {
		await removeFlashSaleItem(id);
	} catch {
		// ignored
	}
	updateTag("flash-sale");
	revalidatePath("/admin/content/flash-sale");
}
