import "server-only";
import { hashPassword, verifyPassword } from "./middleware/password";
import {
	findUserByEmail,
	createUser,
	updateMe,
	deleteMe,
	findUserById,
} from "./user.repository";
import type { SessionUser } from "../schema";
import { getSession } from "./middleware/session";
import {
	actionError,
	actionSuccess,
	databaseError,
	type ActionOutcome,
} from "@/shared/lib/error";

type Role = "user" | "admin" | "super_admin";

type PublicUser = Omit<Awaited<ReturnType<typeof createUser>>, "password">;

/** A copy of the user that is safe to hand out: never includes the password hash. */
function withoutPassword<T extends { password: string }>(
	user: T,
): Omit<T, "password"> {
	const copy: Partial<T> = { ...user };
	delete copy.password;
	return copy as Omit<T, "password">;
}

/**
 * Reads one user by id.
 *
 * This is the primitive the whole app resolves users through: the id must come
 * from a verified session. It answers "who is this id" (or `null` when the
 * account is gone or deactivated), not "is this request allowed".
 */
export async function getUserById(userId: string) {
	const user = await findUserById(userId);
	if (!user || !user.isActive) return null;

	return user;
}

/**
 * The current request's user, resolved from the id in the verified session.
 *
 * Pages and components use this to decide what to render and which actions to
 * offer. It is a read, not a security boundary: every server function that
 * reads or writes data still guards itself with `guard` / `restrictTo`.
 */
export async function getCurrentUser() {
	const userId = await getSession();
	if (!userId) return null;

	return getUserById(userId);
}

export async function registerUser(data: {
	name?: string | null;
	email: string;
	password: string;
	role?: Role;
}): Promise<ActionOutcome<PublicUser>> {
	try {
		const existingUser = await findUserByEmail(data.email);
		if (existingUser) {
			return actionError("An account with that email already exists.");
		}

		const hashedPassword = await hashPassword(data.password);
		const user = await createUser({
			name: data.name ?? null,
			email: data.email,
			password: hashedPassword,
			role: data.role ?? "user",
		});

		return actionSuccess(withoutPassword(user));
	} catch (error) {
		return databaseError(error, "Could not create your account. Try again.");
	}
}

export async function loginUser(data: {
	email: string;
	password: string;
}): Promise<ActionOutcome<PublicUser>> {
	try {
		const user = await findUserByEmail(data.email);
		if (!user) {
			return actionError("Incorrect email or password.");
		}

		const isValid = await verifyPassword(data.password, user.password);
		if (!isValid) {
			return actionError("Incorrect email or password.");
		}

		// A deactivated account would otherwise get a cookie that every page treats
		// as signed out, with no explanation.
		if (!user.isActive) {
			return actionError("This account has been deactivated. Contact support.");
		}

		return actionSuccess(withoutPassword(user));
	} catch (error) {
		return databaseError(error, "Could not sign you in. Try again.");
	}
}

/**
 * Only an authenticated super_admin may create admin accounts.
 */
export async function createAdminUser(
	data: { name?: string | null; email: string; password: string },
	currentUser: SessionUser | null,
	role: Exclude<Role, "user"> = "admin",
): Promise<ActionOutcome<PublicUser>> {
	try {
		if (currentUser?.role !== "super_admin") {
			return actionError("Only super admins can create admin accounts.", {
				reason: "forbidden",
			});
		}

		const existingUser = await findUserByEmail(data.email);
		if (existingUser) {
			return actionError("An account with that email already exists.");
		}

		const hashedPassword = await hashPassword(data.password);
		const user = await createUser({
			name: data.name ?? null,
			email: data.email,
			password: hashedPassword,
			role,
		});

		return actionSuccess(withoutPassword(user));
	} catch (error) {
		return databaseError(
			error,
			"Could not create the admin account. Try again.",
		);
	}
}

export async function updateUserDetails(
	id: string,
	data: {
		name?: string | null;
		email?: string;
		role?: Role;
		isActive?: boolean;
	},
): Promise<ActionOutcome<PublicUser>> {
	try {
		const user = await updateMe(id, data);
		return actionSuccess(withoutPassword(user));
	} catch (error) {
		return databaseError(error, "Could not update the account. Try again.");
	}
}

export async function removeUser(
	id: string,
): Promise<ActionOutcome<{ id: string }>> {
	try {
		await deleteMe(id);
		return actionSuccess({ id });
	} catch (error) {
		return databaseError(error, "Could not delete the account. Try again.");
	}
}
