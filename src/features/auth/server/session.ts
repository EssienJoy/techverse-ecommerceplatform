import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { sessionUserSchema, type SessionUser } from "@/shared/lib";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not set`);
	}
	return value;
}

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

export async function createSessionToken(user: SessionUser): Promise<string> {
	return new SignJWT({ name: user.name, email: user.email, role: user.role })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(user.id)
		.setIssuedAt()
		.setExpirationTime(JWT_EXPIRES)
		.sign(secret);
}

export async function verifySessionToken(
	token: string,
): Promise<SessionUser | null> {
	try {
		const { payload } = await jwtVerify(token, secret);
		const parsed = sessionUserSchema.safeParse({
			id: payload.sub,
			name: payload.name,
			email: payload.email,
			role: payload.role,
		});
		return parsed.success ? parsed.data : null;
	} catch {
		return null;
	}
}

export async function getSession(): Promise<SessionUser | null> {
	const token = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!token) {
		return null;
	}
	return verifySessionToken(token);
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
	(await cookies()).set(SESSION_COOKIE, await createSessionToken(user), {
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
