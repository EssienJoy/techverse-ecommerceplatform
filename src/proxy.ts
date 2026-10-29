import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { withNext } from "@/features/auth/lib/redirect";

async function hasValidSession(request: NextRequest): Promise<boolean> {
	const secret = process.env.JWT_SECRET;
	const cookieName = process.env.SESSION_COOKIE;
	if (!secret || !cookieName) return false;

	const token = request.cookies.get(cookieName)?.value;
	if (!token) return false;

	try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
		return typeof payload.sub === "string" && payload.sub.length > 0;
	} catch {
		return false;
	}
}

export async function proxy(request: NextRequest) {
	if (await hasValidSession(request)) return NextResponse.next();

	const { pathname, search, origin } = request.nextUrl;
	const redirectTo = (path: string) =>
		NextResponse.redirect(new URL(path, origin));

	// The admin sign-in page itself is open to visitors without a session.
	if (pathname === "/admin/login") return NextResponse.next();

	// Any other admin page: sign in to the admin console first.
	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		return redirectTo("/admin/login");
	}

	// Profile and checkout: sign in, then come back.
	return redirectTo(withNext("/login", `${pathname}${search}`));
}

export const config = {
	matcher: ["/admin/:path*", "/profile", "/checkout/:path*"],
};
