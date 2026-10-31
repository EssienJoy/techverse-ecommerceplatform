"use client";

import { Switch } from "@/shared/components/ui/switch";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { NotificationKey } from "../schema";

const rows: {
	key: NotificationKey;
	title: string;
	description: string;
}[] = [
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

export function NotificationSettingsPanel() {
	const notifications = useSettingsStore((state) => state.notifications);
	const toggleNotification = useSettingsStore(
		(state) => state.toggleNotification,
	);

	return (
		<section className='overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
			<div className='border-b border-border/80 px-4 py-3'>
				<h2 className='text-sm font-semibold text-foreground'>Notifications</h2>
				<p className='text-xs text-muted-foreground'>
					Choose what you&apos;d like to hear about.
				</p>
			</div>

			<ul className='divide-y divide-border/80'>
				{rows.map(({ key, title, description }) => (
					<li
						key={key}
						className='flex items-start justify-between gap-4 px-4 py-4'>
						<div className='min-w-0'>
							<p className='text-sm font-medium text-foreground'>{title}</p>
							<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
								{description}
							</p>
						</div>

						<Switch
							checked={notifications[key]}
							onCheckedChange={() => toggleNotification(key)}
							aria-label={title}
							className='mt-1'
						/>
					</li>
				))}
			</ul>
		</section>
	);
}
