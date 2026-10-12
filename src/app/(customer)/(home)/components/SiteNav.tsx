"use client";

import { usePathname } from "next/navigation";
import { MobileNav } from "./MobileNav";

const navRoutes = ["/", "/saved", "/shop", "/cart", "/settings"];

export function SiteNav() {
	const pathname = usePathname();

	if (!navRoutes.includes(pathname)) return null;

	return (
		<footer className='mt-26'>
			<MobileNav />
		</footer>
	);
}