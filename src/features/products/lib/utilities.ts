import "server-only";

import { saveImageFile } from "@/shared/lib/uploads";
import { productInputSchema } from "@/shared/lib";
import type { Product } from "@/shared/lib";
import type { ProductRecord } from "../server/products.repository";

const toSlug = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

function parseVariations(value: FormDataEntryValue | null) {
	if (typeof value !== "string" || value.trim() === "") return undefined;
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
	} catch {
		return undefined;
	}
}

export function parseProductForm(formData: FormData) {
	const name = String(formData.get("name") ?? "").trim();
	const slug = String(formData.get("slug") ?? "").trim();
	const categoryId = String(formData.get("categoryId") ?? "").trim();
	const brandId = String(formData.get("brandId") ?? "").trim();

	const imageEntry = formData.get("imageFile");
	const imageFile =
		imageEntry instanceof File && imageEntry.size > 0 ? imageEntry : null;
	const existingImageUrl = String(formData.get("imageUrl") ?? "").trim();
	const removeBackground = formData.get("removeBackground") === "true";

	const parsed = productInputSchema.safeParse({
		name,
		slug: slug || toSlug(name),
		description: String(formData.get("description") ?? "").trim(),
		imageUrl: existingImageUrl || (imageFile ? "upload-pending" : ""),
		categoryId,
		brandId,
		isActive: formData.get("isActive") === "on",
		variations: parseVariations(formData.get("variations")),
	});

	return { parsed, imageFile, existingImageUrl, removeBackground };
}

export async function resolveImageUrl(
	imageFile: File | null,
	existingImageUrl: string,
	removeBackground = false,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
	if (!imageFile) return { ok: true, url: existingImageUrl };

	const saved = await saveImageFile(imageFile, { removeBackground });
	if (!saved.ok) return { ok: false, error: saved.error };

	return { ok: true, url: saved.url };
}

// Variation attributes are stored as options; the UI shows them as color + size.
export function toVariationAttributes(
	options: { name: string; value: string }[],
): { color: string; size: string } {
	const color = options.find((option) => option.name === "color")?.value ?? "";
	const size = options
		.filter((option) => option.name !== "color")
		.map((option) => option.value)
		.join(" / ");

	return { color, size };
}

export function toProduct(row: ProductRecord): Product {
	const rating = row.ratings.length
		? row.ratings.reduce((sum, entry) => sum + entry.value, 0) /
			row.ratings.length
		: 0;
	const lowestPrice = row.variations.length
		? Math.min(...row.variations.map((variation) => variation.price))
		: 0;
	const availableStocks = row.variations
		.map((variation) => variation.stock)
		.filter((stock) => stock > 0);

	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		description: row.description,
		price: lowestPrice,
		imageUrl: row.imageUrl,
		stock: availableStocks.length ? Math.min(...availableStocks) : 0,
		rating: Math.round(rating * 10) / 10,
		reviews: row._count.reviews,
		variations: row.variations.map((variation) => ({
			id: variation.id,
			sku: variation.sku,
			...toVariationAttributes(variation.options),
			price: variation.price,
			stock: variation.stock,
			features: variation.features,
			images: variation.images.map((image) => image.url),
		})),
		category: row.category.label,
		brand: row.brand.name,
	};
}
