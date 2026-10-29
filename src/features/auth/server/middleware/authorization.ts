import "server-only";
import { redirect } from "next/navigation";
import { getUserById, type AuthResult } from "../user.service";
import { getSession } from "./session";
import { withNext } from "../../lib/redirect";
import type { UserRole } from "../../schema";

export type AuthenticatedUser = NonNullable<
	Awaited<ReturnType<typeof getUserById>>
>;

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];
export const ALL_ROLES: UserRole[] = ["user", ...ADMIN_ROLES];

/**
 * Authentication only. Checks the `Authorization: Bearer <token>` header (or
 * the session cookie) and returns the user id it names.
 *
 * It never touches the database and never checks a role: the id is all a token
 * can prove. Use `authorize` to find out what that id is allowed to do.
 */
export async function protect(): Promise<string | null> {
	return getSession();
}

/**
 * Authorization only. Loads the user behind `userId` and checks that the
 * account is active and holds one of `roles`.
 *
 * Expected denials come back as a result (401 when the id no longer maps to an
 * active account, 403 for the wrong role) so callers can answer in their own
 * shape. Unexpected database failures come back as a 500 result.
 */
export async function authorize(
	userId: string,
	roles: UserRole | UserRole[] = ALL_ROLES,
): Promise<AuthResult<AuthenticatedUser>> {
	const allowedRoles = Array.isArray(roles) ? roles : [roles];

	try {
		const user = await getUserById(userId);

		if (!user) {
			return {
				status: "failure",
				statusCode: 401,
				message: "You must be signed in to do that.",
			};
		}

		if (!allowedRoles.includes(user.role)) {
			return {
				status: "failure",
				statusCode: 403,
				message: "You do not have permission to do that.",
			};
		}

		return { status: "success", statusCode: 200, data: user };
	} catch (error) {
		console.error("Could not verify the current user.", error);

		return {
			status: "error",
			statusCode: 500,
			message: "Could not verify your account. Try again.",
		};
	}
}

/**
 * The backend guard for server functions that read or write data on someone's
 * behalf: authenticate the token with `protect`, then authorize the role with
 * `authorize`. Call it before the database work, not in the page that renders
 * the result.
 */
export async function guard(
	roles: UserRole | UserRole[] = ALL_ROLES,
): Promise<AuthResult<AuthenticatedUser>> {
	let userId: string | null;

	try {
		userId = await protect();
	} catch (error) {
		console.error("Could not read the session.", error);

		return {
			status: "error",
			statusCode: 500,
			message: "Could not verify your account. Try again.",
		};
	}

	if (!userId) {
		return {
			status: "failure",
			statusCode: 401,
			message: "You must be signed in to do that.",
		};
	}

	return authorize(userId, roles);
}

type RedirectOptions = {
	/** Redirect on failure instead of returning a result. */
	redirect: true;
	/** Page to send signed-out visitors to. Defaults to `/login`. */
	loginPath?: string;
	/** Same-site path to return to after signing in. */
	next?: string | null;
	/** Page to send signed-in users who lack the required role to. Defaults to `/`. */
	forbiddenPath?: string;
};

type ResultOptions = {
	redirect?: false;
};

/**
 * Requires a signed-in user with one of the given roles. This is `guard` plus a
 * choice about what a denial looks like.
 *
 * By default it returns a result envelope so resources and server actions can
 * turn a denied request into their own response. Pages and layouts pass
 * `{ redirect: true }` to be sent to the sign-in or forbidden page instead.
 */
export function restrictTo(
	roles: UserRole | UserRole[],
	options: RedirectOptions,
): Promise<AuthenticatedUser>;
export function restrictTo(
	roles: UserRole | UserRole[],
	options?: ResultOptions,
): Promise<AuthResult<AuthenticatedUser>>;
export async function restrictTo(
	roles: UserRole | UserRole[],
	options: RedirectOptions | ResultOptions = {},
): Promise<AuthenticatedUser | AuthResult<AuthenticatedUser>> {
	const result = await guard(roles);

	if (result.status === "success") {
		return options.redirect ? result.data : result;
	}

	if (options.redirect) {
		// A database failure is not a permission decision: let the page's error
		// boundary handle it instead of showing the sign-in or forbidden page.
		if (result.status === "error") throw new Error(result.message);

		if (result.statusCode === 401) {
			redirect(withNext(options.loginPath ?? "/login", options.next ?? null));
		}

		redirect(options.forbiddenPath ?? "/");
	}

	return result;
}
