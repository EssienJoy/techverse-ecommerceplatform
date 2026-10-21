import { Suspense, type ReactNode } from "react";
import { SiteNav } from "@/features/navigation";
import { CartDrawer } from "@/features/cart";

export default function CustomerLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<main>{children}</main>
			<Suspense fallback={null}>
				<SiteNav />
			</Suspense>
			<CartDrawer />
		</>
	);
}
