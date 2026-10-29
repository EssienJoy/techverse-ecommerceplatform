"use server";

import { saveImageFile, type SaveImageResult } from "@/shared/lib/uploads";
import {
	ADMIN_ROLES,
	restrictTo,
} from "@/features/auth/server/middleware/authorization";

export type UploadImageResult = SaveImageResult;

export async function uploadImageAction(
	formData: FormData,
): Promise<UploadImageResult> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status !== "success") return { ok: false, error: access.message };

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return { ok: false, error: "Choose an image to upload." };
	}

	const removeBackground = formData.get("removeBackground") === "true";

	return saveImageFile(file, { removeBackground });
}
