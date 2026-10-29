"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/shared";

const titles: Record<string, string> = {
	"/settings": "Settings",
	"/appearance": "Appearance",
	"/notifications": "Notifications",
	"/contact": "Contact",
};

export default function SettingsLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const isIndex = pathname === "/settings";

	return (
		<Container className='py-4'>
			<header className='grid grid-cols-3 items-center'>
				<div className='flex justify-start'>
					{!isIndex ? (
						<button
							type='button'
							aria-label='Go back'
							onClick={() => router.back()}
							className='flex size-9 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-sm transition-transform active:scale-95'>
							<ChevronLeft className='size-5' />
						</button>
					) : null}
				</div>
				<h1 className='text-center text-xl font-bold leading-tight tracking-tight text-foreground'>
					{titles[pathname] ?? "Settings"}
				</h1>
				<div />
			</header>
			{children}
		</Container>
	);
}