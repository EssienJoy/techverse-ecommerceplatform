import { Suspense, type ReactNode } from "react";
import { SiteNav } from "@/features/navigation";
import { CartDrawer, ShoppingListsSync } from "@/features/cart";

/**
 * Shopping pages: the mobile tab bar, the cart drawer and the sync that keeps
 * the browser cart and saved items in step with the account.
 *
 * Auth pages sit beside this group in `(customer)/(auth)` so they render on
 * their own, without the store chrome.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<main>{children}</main>
			<ShoppingListsSync />
			<Suspense fallback={null}>
				<SiteNav />
			</Suspense>
			<CartDrawer />
		</>
	);
}
