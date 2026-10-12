import Link from "next/link";
import { Bell, ChevronRight, MessageCircle, Palette } from "lucide-react";
import { siteConfig } from "@/shared";

const items = [
	{
		href: "/appearance",
		label: "Appearance",
		description: "Theme and display preferences",
		icon: Palette,
	},
	{
		href: "/notifications",
		label: "Notifications",
		description: "Choose what updates you receive",
		icon: Bell,
	},
	{
		href: "/contact",
		label: "Contact",
		description: "Reach us on WhatsApp, email or phone",
		icon: MessageCircle,
	},
];

export default function SettingsPage() {
	return (
		<>
			<p className='mt-2 text-sm text-muted-foreground'>
				Manage how {siteConfig.name} looks and how you reach us.
			</p>

			<ul className='mt-4 divide-y divide-border overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
				{items.map(({ href, label, description, icon: Icon }) => (
					<li key={href}>
						<Link
							href={href}
							className='flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/50'>
							<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-primary'>
								<Icon className='size-4' />
							</span>
							<span className='flex flex-1 flex-col'>
								<span className='text-sm font-medium text-foreground'>
									{label}
								</span>
								<span className='mt-0.5 text-xs text-muted-foreground'>
									{description}
								</span>
							</span>
							<ChevronRight className='size-4 text-muted-foreground' />
						</Link>
					</li>
				))}
			</ul>
		</>
	);
}