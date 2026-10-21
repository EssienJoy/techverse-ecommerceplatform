"use server";

import { redirect } from "next/navigation";
import { createUserInputSchema } from "@/shared/lib";
import { createAdminUser } from "./auth.service";
import { getCurrentUser } from "./current-user";
import { verifyPassword } from "./password";
import { findUserByEmail } from "./users.repository";
import { clearSessionCookie, setSessionCookie } from "./session";

export type AuthFormState = {
	fieldErrors?: Record<string, string[]>;
	error?: string | null;
	success?: string | null;
};

export async function loginAction(
	_prevState: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const email = String(formData.get("email") ?? "").trim().toLowerCase();
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		return { error: "Enter your email and password." };
	}

	const user = await findUserByEmail(email);

	if (!user || !(await verifyPassword(password, user.password))) {
		return { error: "Incorrect email or password." };
	}

	await setSessionCookie({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	});
	redirect("/admin");
}

export async function createUserAction(
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
		return {
			fieldErrors: { confirmPassword: ["Passwords do not match."] },
		};
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
