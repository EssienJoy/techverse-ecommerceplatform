import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container, Link, siteConfig } from "@/shared";

export const metadata: Metadata = {
	title: `Admin | ${siteConfig.name}`,
	description: `Sign in to the ${siteConfig.name} admin console.`,
};

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<main>
			<Container
				className='flex flex-col items-center min-h-dvh
			justify-center bg-surface-muted p-4'>
				<Link
					href='/admin'
					className='mb-6 flex items-center justify-center gap-2.5'>
					<span className='flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-foreground-inverse'>
						{siteConfig.name.charAt(0)}
					</span>
					<span className='flex flex-col leading-tight'>
						<span className='text-sm font-bold tracking-tight'>
							{siteConfig.name}
						</span>
						<span className='text-xs text-muted-foreground'>Admin console</span>
					</span>
				</Link>
				<section>{children}</section>
			</Container>
		</main>
	);
}
