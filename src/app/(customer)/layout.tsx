import { Suspense, type ReactNode } from "react";
import { SiteNav } from "@/features/navigation";
import { CartDrawer, ShoppingListsSync } from "@/features/cart";

export default function CustomerLayout({ children }: { children: ReactNode }) {
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
