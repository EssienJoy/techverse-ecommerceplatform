"use server";

import { saveImageFile, type SaveImageResult } from "@/shared/lib/uploads";
import { requireAdmin } from "@/features/auth/server/user.service";

export type UploadImageResult = SaveImageResult;

export async function uploadImageAction(
	formData: FormData,
): Promise<UploadImageResult> {
	const access = await requireAdmin();
	if (!access.ok) return { ok: false, error: access.message };

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return { ok: false, error: "Choose an image to upload." };
	}

	const removeBackground = formData.get("removeBackground") === "true";

	return saveImageFile(file, { removeBackground });
}
