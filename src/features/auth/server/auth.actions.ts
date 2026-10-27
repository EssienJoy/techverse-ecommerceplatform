"use server";

import { redirect } from "next/navigation";
import { createUserInputSchema } from "../schema";
import { getCurrentUser } from "./user.service";
import {
	setSessionCookie,
	clearSessionCookie,
	getSession,
} from "./middleware/session";
import { registerUser, loginUser, createAdminUser } from "./user.service";
import { safeRedirectPath } from "../lib/redirect";
import { claimGuestActivity } from "@/features/guest/server/merge-guest.service";

export type AuthFormState = {
	fieldErrors?: Record<string, string[]>;
	error?: string | null;
	success?: string | null;
};

export async function loginAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		return { error: "Enter your email and password." };
	}

	const result = await loginUser({ email, password });
	if (!result.ok) {
		return { error: result.error };
	}

	await setSessionCookie(result.user);

	if (result.user.role === "admin" || result.user.role === "super_admin") {
		redirect("/admin");
	}

	// Carry the visitor's guest cart and history into their account.
	await claimGuestActivity(result.user.id);
	redirect(safeRedirectPath(formData.get("next")) ?? "/");
}

export async function userSignupAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const parsed = createUserInputSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const confirmPassword = String(formData.get("confirmPassword") ?? "");
	if (parsed.data.password !== confirmPassword) {
		return { fieldErrors: { confirmPassword: ["Passwords do not match."] } };
	}

	const result = await registerUser({ ...parsed.data, role: "user" });
	if (!result.ok) {
		return { error: result.error, success: null };
	}

	await setSessionCookie(result.user);
	await claimGuestActivity(result.user.id);
	redirect(safeRedirectPath(formData.get("next")) ?? "/");
}

export async function adminSignupAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const currentUser = await getCurrentUser();

	const parsed = createUserInputSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	const confirmPassword = String(formData.get("confirmPassword") ?? "");
	if (parsed.data.password !== confirmPassword) {
		return { fieldErrors: { confirmPassword: ["Passwords do not match."] } };
	}

	const result = await createAdminUser(parsed.data, currentUser);
	if (!result.ok) {
		return { error: result.error };
	}

	return {
		success: `Account created for ${result.user.email}. They can now sign in.`,
	};
}

export async function logoutAction(): Promise<void> {
	const session = await getSession();
	await clearSessionCookie();

	if (session?.role === "admin" || session?.role === "super_admin") {
		redirect("/admin/login");
	}
	redirect("/login");
}
