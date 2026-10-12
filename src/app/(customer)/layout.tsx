import { Suspense } from "react";
import type { ReactNode } from "react";
import { SiteNav } from "./(home)/components";
import { CartDrawer } from "@/shared";

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
