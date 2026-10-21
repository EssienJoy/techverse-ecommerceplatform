import type { ReactNode } from "react";
import { MonitorX } from "lucide-react";
import { siteConfig } from "@/shared";

export function ScreenGuard({ children }: { children: ReactNode }) {
	return (
		<section>
			<div className='md:hidden'>{children}</div>
			<div className='hidden min-h-screen flex-col items-center justify-center gap-4 px-6 text-center md:flex'>
				<MonitorX className='size-12 text-primary' />
				<h1 className='text-2xl font-bold'>
					{siteConfig.name} is not available on tabs and laptops
				</h1>
				<p className='max-w-sm text-muted-foreground'>
					We are currently mobile-only. Please visit us on your phone for the
					best experience.
				</p>
			</div>
		</section>
	);
}
