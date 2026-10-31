import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	actionHref?: string;
};

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionHref,
}: EmptyStateProps) {
	return (
		<div className='flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center'>
			<div className='flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600'>
				<Icon className='size-7' />
			</div>
			<h2 className='mt-5 text-lg font-bold text-foreground'>{title}</h2>
			<p className='mt-2 max-w-xs text-sm text-muted-foreground'>
				{description}
			</p>
			{actionLabel && actionHref ? (
				<Link
					href={actionHref}
					className='mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium whitespace-nowrap text-foreground-inverse transition-all hover:bg-primary/80 active:translate-y-px'>
					{actionLabel}
					<ArrowRight className='size-4' />
				</Link>
			) : null}
		</div>
	);
}