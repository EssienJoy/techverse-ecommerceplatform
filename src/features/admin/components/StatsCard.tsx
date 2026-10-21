import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent } from "@/shared/components/ui/card";

type StatsCardProps = {
	label: string;
	value: string;
	icon: LucideIcon;
	change?: number;
};

export function StatsCard({
	label,
	value,
	icon: Icon,
	change,
}: StatsCardProps) {
	const isUp = (change ?? 0) >= 0;
	const TrendIcon = isUp ? TrendingUp : TrendingDown;

	return (
		<Card
			size='sm'
			className='transition-shadow duration-200 hover:ring-foreground/20'>
			<CardContent className='flex items-start gap-3'>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 ring-1 ring-brand-300/60'>
					<Icon className='size-5' />
				</span>

				<div className='flex min-w-0 flex-1 flex-col'>
					<p className='truncate text-xs font-medium tracking-wide text-muted-foreground uppercase'>
						{label}
					</p>
					<p className='mt-1 truncate text-lg font-semibold tracking-tight tabular-nums'>
						{value}
					</p>
					{change !== undefined ? (
						<div className='mt-2 flex items-center gap-1.5'>
							<span
								className={cn(
									"inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
									isUp
										? "bg-success-muted text-success-foreground"
										: "bg-danger-muted text-danger-foreground",
								)}>
								<TrendIcon className='size-3.5' />
								{Math.abs(change)}%
							</span>
							<span className='truncate text-xs text-muted-foreground'>
								vs last week
							</span>
						</div>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}
