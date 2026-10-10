import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

type StatsCardProps = {
	label: string;
	value: string;
	icon: LucideIcon;
};

export function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
	return (
		<Card size='sm'>
			<CardContent className='flex items-center justify-between'>
				<div>
					<p className='text-sm text-muted-foreground'>{label}</p>
					<p className='mt-1 text-xl font-bold'>{value}</p>
				</div>
				<span className='flex size-9 items-center justify-center rounded-xl bg-brand-50 text-primary'>
					<Icon className='size-4' />
				</span>
			</CardContent>
		</Card>
	);
}
