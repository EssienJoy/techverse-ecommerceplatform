"use server";

import { revalidatePath } from "next/cache";
import { createUserInputSchema } from "@/shared/lib";
import { getCurrentUser } from "@/features/auth/server/user.service";
import { updateMe } from "@/features/auth/server/user.repository";
import {
	hashPassword,
	verifyPassword,
} from "@/features/auth/server/middleware/password";
import { findUserByEmail } from "@/features/auth/server/user.repository";

export type ProfileFormState = {
	fieldErrors?: Record<string, string[]>;
	error?: string | null;
	success?: string | null;
};

export async function updateProfileAction(
	_prev: ProfileFormState,
	formData: FormData,
): Promise<ProfileFormState> {
	const user = await getCurrentUser();
	if (!user) return { error: "You must be signed in." };

	const name = String(formData.get("name") ?? "").trim();
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();

	if (!email) {
		return { fieldErrors: { email: ["Email is required."] } };
	}

	// Email uniqueness if changed
	if (email !== user.email) {
		const existing = await findUserByEmail(email);
		if (existing && existing.id !== user.id) {
			return { fieldErrors: { email: ["That email is already in use."] } };
		}
	}

	try {
		await updateMe(user.id, { name: name || null, email });
		revalidatePath("/profile");
		return { success: "Profile updated.", error: null };
	} catch (err) {
		console.error(err);
		return {
			error: err instanceof Error ? err.message : "Could not update profile.",
		};
	}
}

export async function updatePasswordAction(
	_prev: ProfileFormState,
	formData: FormData,
): Promise<ProfileFormState> {
	const user = await getCurrentUser();
	if (!user) return { error: "You must be signed in." };

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

	if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

	const ok = await verifyPassword(currentPassword, user.password);
	if (!ok) {
		return { fieldErrors: { currentPassword: ["Incorrect password."] } };
	}

	try {
		const hashed = await hashPassword(password);
		await updateMe(user.id, { password: hashed });
		return { success: "Password updated.", error: null };
	} catch (err) {
		console.error(err);
		return {
			error: err instanceof Error ? err.message : "Could not update password.",
		};
	}
}
