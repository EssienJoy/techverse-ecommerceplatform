import type { ReactNode } from "react";
import { MonitorX } from "lucide-react";
import { siteConfig } from "@/shared";

/**
 * The customer store is mobile-only. Below `sm` the page renders normally;
 * from `sm` up the page is replaced by a short notice.
 *
 * Admin pages are outside the customer layout, so this never hides them.
 */
export function ScreenGuard({ children }: { children: ReactNode }) {
	return (
		<section>
			<div className='sm:hidden'>{children}</div>
			<div className='hidden min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center sm:flex'>
				<MonitorX className='size-12 text-primary' />
				<h1 className='text-2xl font-bold'>
					{siteConfig.name} is mobile only
				</h1>
				<p className='max-w-sm text-muted-foreground'>
					We are not available on desktop yet. Please open this page on your
					phone to keep shopping.
				</p>
			</div>
		</section>
	);
}
