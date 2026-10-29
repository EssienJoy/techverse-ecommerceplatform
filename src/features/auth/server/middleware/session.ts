import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { requireEnv } from "@/shared/lib/utils";

const JWT_SECRET = requireEnv("JWT_SECRET");
const JWT_EXPIRES = requireEnv("JWT_EXPIRES");
const SESSION_COOKIE = requireEnv("SESSION_COOKIE");
const JWT_COOKIE_EXPIRES_IN = Number(requireEnv("JWT_COOKIE_EXPIRES_IN"));

if (!Number.isFinite(JWT_COOKIE_EXPIRES_IN) || JWT_COOKIE_EXPIRES_IN <= 0) {
	throw new Error("JWT_COOKIE_EXPIRES_IN must be a positive number of days");
}

const COOKIE_MAX_AGE = JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60;
const secret = new TextEncoder().encode(JWT_SECRET);

export { SESSION_COOKIE };

export async function createSessionToken(userId: string): Promise<string> {
	return new SignJWT({})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(userId)
		.setIssuedAt()
		.setExpirationTime(JWT_EXPIRES)
		.sign(secret);
}

/**
 * Verifies the token signature and returns its subject: the user id.
 * Nothing else in the payload is trusted.
 */
export async function verifySessionToken(
	token: string,
): Promise<string | null> {
	try {
		const { payload } = await jwtVerify(token, secret);
		return typeof payload.sub === "string" && payload.sub.length > 0
			? payload.sub
			: null;
	} catch {
		return null;
	}
}

/**
 * Reads the session token from the `Authorization: Bearer <token>` header,
 * falling back to the session cookie when the header is absent.
 */
export async function getSessionToken(): Promise<string | null> {
	const authorization = (await headers()).get("authorization");

	if (authorization) {
		const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
		return match ? match[1].trim() : null;
	}

	return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

/** Returns the signed-in user's id from the bearer token or session cookie. */
export async function getSession(): Promise<string | null> {
	const token = await getSessionToken();
	if (!token) {
		return null;
	}
	return verifySessionToken(token);
}

export async function setSessionCookie(userId: string): Promise<void> {
	(await cookies()).set(SESSION_COOKIE, await createSessionToken(userId), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: COOKIE_MAX_AGE,
	});
}

export async function clearSessionCookie(): Promise<void> {
	(await cookies()).delete(SESSION_COOKIE);
}