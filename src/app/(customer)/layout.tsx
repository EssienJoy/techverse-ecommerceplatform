import type { ReactNode } from "react";
import { MobileNav } from "./(home)/components";

export default function CustomerLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<main>{children}</main>
			<footer className='mt-26'>
				<MobileNav />
			</footer>
		</>
	);
}
