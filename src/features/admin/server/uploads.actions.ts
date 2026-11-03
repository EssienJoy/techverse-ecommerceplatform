"use server";

import { saveImageFile } from "@/shared/lib/uploads";
import {
	ADMIN_ROLES,
	restrictTo,
} from "@/features/auth/server/middleware/authorization";
import {
	actionError,
	actionSuccess,
	type ActionOutcome,
} from "@/shared/lib/error";

export async function uploadImageAction(
	formData: FormData,
): Promise<ActionOutcome<{ url: string }>> {
	const access = await restrictTo(ADMIN_ROLES);
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}

	const file = formData.get("file");

	if (!(file instanceof File)) {
		return actionError("Choose an image to upload.");
	}

	const removeBackground = formData.get("removeBackground") === "true";
	const result = await saveImageFile(file, { removeBackground });

	return result.ok
		? actionSuccess({ url: result.url })
		: actionError(result.error);
}
