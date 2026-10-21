"use client";

import { Switch } from "@/shared/components/ui/switch";
import {
	useSettingsStore,
	type NotificationKey,
} from "@/features/account/stores/useSettingsStore";

const rows: { key: NotificationKey; title: string; description: string }[] = [
	{
		key: "orderUpdates",
		title: "Order updates",
		description: "Delivery status and receipts for your purchases.",
	},
	{
		key: "promotions",
		title: "Promotions & deals",
		description: "Discounts, bundles and limited-time offers.",
	},
	{
		key: "newsletter",
		title: "Newsletter",
		description: "New arrivals and product highlights, twice a month.",
	},
];

export default function NotificationsPage() {
	const notifications = useSettingsStore((state) => state.notifications);
	const toggleNotification = useSettingsStore(
		(state) => state.toggleNotification,
	);

	return (
		<section className='mt-4'>
			<p className='text-sm text-muted-foreground'>
				Choose what you&apos;d like to hear about.
			</p>

			<div className='mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
				{rows.map((row) => (
					<label
						key={row.key}
						className='flex items-center justify-between gap-4 px-4 py-3.5'>
						<span className='flex flex-col'>
							<span className='text-sm font-medium text-foreground'>
								{row.title}
							</span>
							<span className='mt-0.5 text-xs text-muted-foreground'>
								{row.description}
							</span>
						</span>
						<Switch
							checked={notifications[row.key]}
							onCheckedChange={() => toggleNotification(row.key)}
							aria-label={row.title}
						/>
					</label>
				))}
			</div>
		</section>
	);
}