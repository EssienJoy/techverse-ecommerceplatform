import "server-only";
import { hashPassword, verifyPassword } from "./middleware/password";
import {
	findUserByEmail,
	createUser,
	updateMe,
	deleteMe,
	findUserById,
} from "./user.repository";
import type { SessionUser } from "@/shared/lib";
import { getSession } from "./middleware/session";
import { redirect } from "next/navigation";

type Role = "user" | "admin" | "super_admin";

export type AdminAccess =
	| { ok: true; user: Awaited<ReturnType<typeof getCurrentUser>> }
	| { ok: false; message: string };

/**
 * Resolves the current request's user from the session cookie.
 */
export async function getCurrentUser() {
	const session = await getSession();
	if (!session) return null;

	const user = await findUserById(session.id);
	if (!user || !user.isActive) return null;

	return user;
}

export async function requireAdmin(): Promise<AdminAccess> {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/admin/login");
		return { ok: false, message: "Authentication required." };
	}

	if (user.role !== "admin" && user.role !== "super_admin") {
		redirect("/");
		return { ok: false, message: "Admin access required." };
	}

	return { ok: true, user };
}

export async function registerUser(data: {
	name?: string | null;
	email: string;
	password: string;
	role?: Role;
}) {
	const existingUser = await findUserByEmail(data.email);
	if (existingUser) {
		return {
			ok: false as const,
			error: "An account with that email already exists.",
		};
	}

	const hashedPassword = await hashPassword(data.password);
	const user = await createUser({
		name: data.name ?? null,
		email: data.email,
		password: hashedPassword,
		role: data.role ?? "user",
	});

	const { password: _password, ...result } = user;
	return { ok: true as const, user: result };
}

export async function loginUser(data: { email: string; password: string }) {
	const user = await findUserByEmail(data.email);
	if (!user) {
		return { ok: false as const, error: "Incorrect email or password." };
	}

	const isValid = await verifyPassword(data.password, user.password);
	if (!isValid) {
		return { ok: false as const, error: "Incorrect email or password." };
	}

	const { password: _password, ...result } = user;
	return { ok: true as const, user: result };
}

/**
 * Only an authenticated admin/super_admin may create admin accounts.
 */
export async function createAdminUser(
	data: { name?: string | null; email: string; password: string },
	currentUser: SessionUser | null,
	role: Exclude<Role, "user"> = "admin",
) {
	if (!currentUser || !["admin", "super_admin"].includes(currentUser.role)) {
		return {
			ok: false as const,
			error: "Not authorized to create admin accounts.",
		};
	}

	const existingUser = await findUserByEmail(data.email);
	if (existingUser) {
		return {
			ok: false as const,
			error: "An account with that email already exists.",
		};
	}

	const hashedPassword = await hashPassword(data.password);
	const user = await createUser({
		name: data.name ?? null,
		email: data.email,
		password: hashedPassword,
		role,
	});

	const { password: _password, ...result } = user;
	return { ok: true as const, user: result };
}

export async function updateUserDetails(
	id: string,
	data: {
		name?: string | null;
		email?: string;
		role?: Role;
		isActive?: boolean;
	},
) {
	const user = await updateMe(id, data);
	const { password: _password, ...result } = user;
	return { ok: true as const, user: result };
}

export async function removeUser(id: string) {
	await deleteMe(id);
	return { ok: true as const };
}
