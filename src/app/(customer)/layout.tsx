import type { ReactNode } from "react";
import { ScreenGuard } from "@/features/storefront";

/**
 * The customer store is mobile-only: above `sm` every page under `(customer)`
 * is replaced by a short "not available on desktop" screen.
 *
 * Admin pages live in `(admin)` and are not affected.
 */
export default function CustomerLayout({ children }: { children: ReactNode }) {
	return <ScreenGuard>{children}</ScreenGuard>;
}
