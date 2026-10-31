"use client";

import NextLink from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/shared";

type ProfileHeaderProps = {
	title: string;
	subtitle?: string;
	/** Pass `false` on the dashboard itself. Every other page points back there. */
	back?: boolean;
};

export function ProfileHeader({
	title,
	subtitle,
	back = true,
}: ProfileHeaderProps) {
	return (
		<header className='py-4'>
			<Container className='grid grid-cols-[2.25rem_1fr_2.25rem] items-center'>
				<div className='flex justify-start'>
					{back ? (
						<NextLink
							href='/profile'
							aria-label='Back to profile'
							className='flex size-9 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-sm transition-transform active:scale-95'>
							<ChevronLeft className='size-5' />
						</NextLink>
					) : null}
				</div>

				<div className='text-center'>
					<h1 className='text-lg font-bold leading-tight tracking-tight text-foreground'>
						{title}
					</h1>
					{subtitle ? (
						<p className='text-[11px] font-medium text-muted-foreground'>
							{subtitle}
						</p>
					) : null}
				</div>

				<div />
			</Container>
		</header>
	);
}
