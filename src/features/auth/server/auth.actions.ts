"use server";

import { redirect } from "next/navigation";
import { createUserInputSchema } from "@/shared/lib";
import { getCurrentUser } from "./user.service";
import { setSessionCookie, clearSessionCookie } from "./middleware/session";
import { registerUser, loginUser, createAdminUser } from "./user.service";

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
	redirect("/store");
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

	const result = await registerUser({ ...parsed.data, role: "user" });
	if (!result.ok) {
		return { error: result.error, success: null };
	}

	// Optional: auto-login after signup
	await setSessionCookie(result.user);

	return { success: "Account created successfully.", error: null };
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
	await clearSessionCookie();
	redirect("/admin/login");
}
