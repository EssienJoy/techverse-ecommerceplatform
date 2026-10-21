import type { SessionUser } from "@/shared/lib";
import { getSession } from "./session";

export function isAdminRole(role: SessionUser["role"]): boolean {
	return role === "admin" || role === "super_admin";
}

/**
 * Resolves the signed-in admin from the JWT session cookie.
 * Returns null when there is no valid session.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
	const session = await getSession();

	if (!session || !isAdminRole(session.role)) {
		return null;
	}

	return session;
}

export type RequireAdminResult =
	| { ok: true; user: SessionUser }
	| { ok: false; status: 401 | 403; message: string };

export async function requireAdmin(): Promise<RequireAdminResult> {
	const user = await getCurrentUser();

	if (!user) {
		return { ok: false, status: 401, message: "Authentication required" };
	}

	return { ok: true, user };
}

export async function requireSuperAdmin(): Promise<RequireAdminResult> {
	const user = await getCurrentUser();

	if (!user) {
		return { ok: false, status: 401, message: "Authentication required" };
	}

	if (user.role !== "super_admin") {
		return {
			ok: false,
			status: 403,
			message: "Super administrator role required",
		};
	}

	return { ok: true, user };
}
