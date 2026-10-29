"use server";

import { redirect } from "next/navigation";
import { createUserInputSchema, type UserRole } from "../schema";
import {
	registerUser,
	loginUser,
	createAdminUser,
	getCurrentUser,
} from "./user.service";
import {
	setSessionCookie,
	clearSessionCookie,
} from "./middleware/session";
import { restrictTo } from "./middleware/authorization";
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
	if (result.status !== "success") {
		return { error: result.message };
	}

	await setSessionCookie(result.data.id);

	if (result.data.role === "admin" || result.data.role === "super_admin") {
		redirect("/admin");
	}

	// Carry the visitor's guest cart and history into their account.
	await claimGuestActivity(result.data.id);
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
	if (result.status !== "success") {
		return { error: result.message, success: null };
	}

	await setSessionCookie(result.data.id);
	await claimGuestActivity(result.data.id);
	redirect(safeRedirectPath(formData.get("next")) ?? "/");
}

export async function adminSignupAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const access = await restrictTo("super_admin");
	if (access.status !== "success") return { error: access.message };

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

	const result = await createAdminUser(parsed.data, access.data);
	if (result.status !== "success") {
		return { error: result.message };
	}

	return {
		success: `Account created for ${result.data.email}. They can now sign in.`,
	};
}

export async function logoutAction(): Promise<void> {
	// Signing out only needs to know whether an admin was signed in so it can
	// send them to the admin sign-in page; clearing the cookie never depends on
	// the account still being active.
	const user = await getCurrentUser();
	await clearSessionCookie();

	if (user?.role === "admin" || user?.role === "super_admin") {
		redirect("/admin/login");
	}
	redirect("/login");
}

export async function getViewerRoleAction(): Promise<UserRole | null> {
	const user = await getCurrentUser();
	return user?.role ?? null;
}
