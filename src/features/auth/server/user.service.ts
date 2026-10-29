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

type Role = "user" | "admin" | "super_admin";

type PublicUser = Omit<Awaited<ReturnType<typeof createUser>>, "password">;

export type AuthResult<T> =
	| { status: "success"; statusCode: number; data: T }
	| { status: "failure" | "error"; statusCode: number; message: string };

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
}): Promise<AuthResult<PublicUser>> {
	try {
		const existingUser = await findUserByEmail(data.email);
		if (existingUser) {
			return {
				status: "failure",
				statusCode: 409,
				message: "An account with that email already exists.",
			};
		}

		const hashedPassword = await hashPassword(data.password);
		const user = await createUser({
			name: data.name ?? null,
			email: data.email,
			password: hashedPassword,
			role: data.role ?? "user",
		});

		return {
			status: "success",
			statusCode: 201,
			data: withoutPassword(user),
		};
	} catch (error) {
		console.error("Could not register a user.", error);
		return {
			status: "error",
			statusCode: 500,
			message: "Could not create your account. Try again.",
		};
	}
}

export async function loginUser(data: {
	email: string;
	password: string;
}): Promise<AuthResult<PublicUser>> {
	try {
		const user = await findUserByEmail(data.email);
		if (!user) {
			return {
				status: "failure",
				statusCode: 401,
				message: "Incorrect email or password.",
			};
		}

		const isValid = await verifyPassword(data.password, user.password);
		if (!isValid) {
			return {
				status: "failure",
				statusCode: 401,
				message: "Incorrect email or password.",
			};
		}

		// A deactivated account would otherwise get a cookie that every page treats
		// as signed out, with no explanation.
		if (!user.isActive) {
			return {
				status: "failure",
				statusCode: 403,
				message: "This account has been deactivated. Contact support.",
			};
		}

		return { status: "success", statusCode: 200, data: withoutPassword(user) };
	} catch (error) {
		console.error("Could not sign in a user.", error);
		return {
			status: "error",
			statusCode: 500,
			message: "Could not sign you in. Try again.",
		};
	}
}

/**
 * Only an authenticated super_admin may create admin accounts.
 */
export async function createAdminUser(
	data: { name?: string | null; email: string; password: string },
	currentUser: SessionUser | null,
	role: Exclude<Role, "user"> = "admin",
): Promise<AuthResult<PublicUser>> {
	try {
		if (currentUser?.role !== "super_admin") {
			return {
				status: "failure",
				statusCode: 403,
				message: "Only super admins can create admin accounts.",
			};
		}

		const existingUser = await findUserByEmail(data.email);
		if (existingUser) {
			return {
				status: "failure",
				statusCode: 409,
				message: "An account with that email already exists.",
			};
		}

		const hashedPassword = await hashPassword(data.password);
		const user = await createUser({
			name: data.name ?? null,
			email: data.email,
			password: hashedPassword,
			role,
		});

		return {
			status: "success",
			statusCode: 201,
			data: withoutPassword(user),
		};
	} catch (error) {
		console.error("Could not create an admin user.", error);
		return {
			status: "error",
			statusCode: 500,
			message: "Could not create the admin account. Try again.",
		};
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
): Promise<AuthResult<PublicUser>> {
	try {
		const user = await updateMe(id, data);
		return { status: "success", statusCode: 200, data: withoutPassword(user) };
	} catch (error) {
		console.error("Could not update a user.", error);
		return {
			status: "error",
			statusCode: 500,
			message: "Could not update the account. Try again.",
		};
	}
}

export async function removeUser(
	id: string,
): Promise<AuthResult<{ id: string }>> {
	try {
		await deleteMe(id);
		return { status: "success", statusCode: 200, data: { id } };
	} catch (error) {
		console.error("Could not delete a user.", error);
		return {
			status: "error",
			statusCode: 500,
			message: "Could not delete the account. Try again.",
		};
	}
}
