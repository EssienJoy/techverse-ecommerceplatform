/**
 * Accepts only same-site relative paths so a `next` parameter can't be used
 * as an open redirect (e.g. `//evil.com` or `https://evil.com`).
 */
export function safeRedirectPath(value: unknown): string | null {
	if (typeof value !== "string") return null;
	if (!value.startsWith("/") || value.startsWith("//")) return null;
	if (value.includes("\\")) return null;
	return value;
}

export function withNext(path: string, next: string | null): string {
	return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
