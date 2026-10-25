"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

export function SiteNav() {
	const navRoutes = ["/", "/saved", "/shop", "/cart", "/profile"];
	const pathname = usePathname();

	if (!navRoutes.includes(pathname)) return null;

	return (
		<footer className='mt-25'>
			<MobileNav />
		</footer>
	);
}
