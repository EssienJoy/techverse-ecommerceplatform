"use server";

import { revalidatePath } from "next/cache";
import { guard } from "@/features/auth/server/middleware/authorization";
import { updateMe } from "@/features/auth/server/user.repository";
import {
	hashPassword,
	verifyPassword,
} from "@/features/auth/server/middleware/password";
import { findUserByEmail } from "@/features/auth/server/user.repository";
import {
	actionError,
	actionSuccess,
	databaseError,
	validationError,
} from "@/shared/lib/error";
import type { ProfileFormState } from "../types";

export async function updateProfileAction(
	_prev: ProfileFormState,
	formData: FormData,
): Promise<ProfileFormState> {
	const access = await guard();
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}
	const user = access.data;

	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();

	if (!email) {
		return validationError({ email: ["Email is required."] });
	}

	// Email uniqueness if changed
	if (email !== user.email) {
		const existing = await findUserByEmail(email);
		if (existing && existing.id !== user.id) {
			return validationError({ email: ["That email is already in use."] });
		}
	}

	try {
		await updateMe(user.id, { name: name || null, email });
		revalidatePath("/profile", "layout");
		return actionSuccess(undefined, "Profile updated.");
	} catch (error) {
		return databaseError(error, "Could not update profile. Try again.");
	}
}

export async function updatePasswordAction(
	_prev: ProfileFormState,
	formData: FormData,
): Promise<ProfileFormState> {
	const access = await guard();
	if (access.status === "error") {
		return actionError(access.message, { reason: access.reason });
	}
	const user = access.data;

	const currentPassword = String(formData.get("currentPassword") ?? "");
	const password = String(formData.get("password") ?? "");
	const confirmPassword = String(formData.get("confirmPassword") ?? "");

	const fieldErrors: Record<string, string[]> = {};
	if (!currentPassword)
		fieldErrors.currentPassword = ["Enter your current password."];
	if (password.length < 8)
		fieldErrors.password = ["Use at least 8 characters."];
	if (password !== confirmPassword)
		fieldErrors.confirmPassword = ["Passwords do not match."];

	if (Object.keys(fieldErrors).length > 0) return validationError(fieldErrors);

	const ok = await verifyPassword(currentPassword, user.password);
	if (!ok) {
		return validationError({ currentPassword: ["Incorrect password."] });
	}

	try {
		const hashed = await hashPassword(password);
		await updateMe(user.id, { password: hashed });
		return actionSuccess(undefined, "Password updated.");
	} catch (error) {
		return databaseError(error, "Could not update password. Try again.");
	}
}
