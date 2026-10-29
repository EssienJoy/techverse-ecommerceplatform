import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import {
	createGuestSessionRecord,
	findActiveGuestSessionByHash,
	renewGuestSessionRecord,
} from "./guest.repository";

/**
 * Guest identity.
 *
 * The browser holds a random token; the database holds only its SHA-256 hash.
 * The cookie is just a key: it grants access only if it matches an unexpired,
 * unclaimed row. A guessed or tampered value matches nothing, and a claimed
 * session is never reused, so an old cookie can't reach an account's data.
 *
 * Cookies can only be written from Server Actions and Route Handlers, so
 * `getOrCreateGuestSession` must only be called from those. `findGuestSession`
 * is read-only and safe in Server Components.
 */

const GUEST_COOKIE = process.env.GUEST_COOKIE ?? "technest_guest";
const GUEST_TTL_DAYS = 90;
const RENEW_AFTER_MS = 24 * 60 * 60 * 1000;
const TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/; // 32 random bytes, base64url

const hashToken = (token: string) =>
	createHash("sha256").update(token).digest("hex");

const expiryFromNow = () =>
	new Date(Date.now() + GUEST_TTL_DAYS * 24 * 60 * 60 * 1000);

async function setGuestCookie(token: string) {
	(await cookies()).set(GUEST_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: GUEST_TTL_DAYS * 24 * 60 * 60,
	});
}

async function readValidToken(): Promise<string | null> {
	const token = (await cookies()).get(GUEST_COOKIE)?.value;
	return token && TOKEN_FORMAT.test(token) ? token : null;
}

/** The visitor's guest session, or null. Never creates or writes anything. */
export async function findGuestSession() {
	const token = await readValidToken();
	if (!token) return null;

	return findActiveGuestSessionByHash(hashToken(token));
}

/**
 * The visitor's guest session, created on first use. Slides the expiry
 * forward (at most once a day) while the visitor stays active.
 * Server Actions / Route Handlers only.
 */
export async function getOrCreateGuestSession() {
	const token = await readValidToken();
	const existing = token
		? await findActiveGuestSessionByHash(hashToken(token))
		: null;

	if (existing && token) {
		if (Date.now() - existing.lastSeenAt.getTime() > RENEW_AFTER_MS) {
			const renewed = await renewGuestSessionRecord(
				existing.id,
				expiryFromNow(),
			);
			await setGuestCookie(token);
			return renewed;
		}
		return existing;
	}

	// No cookie, a malformed one, an expired one, or one already claimed:
	// start a fresh identity. The old one stays unreachable.
	const freshToken = randomBytes(32).toString("base64url");
	const created = await createGuestSessionRecord({
		tokenHash: hashToken(freshToken),
		expiresAt: expiryFromNow(),
	});
	await setGuestCookie(freshToken);
	return created;
}

export async function clearGuestCookie() {
	(await cookies()).delete(GUEST_COOKIE);
}
