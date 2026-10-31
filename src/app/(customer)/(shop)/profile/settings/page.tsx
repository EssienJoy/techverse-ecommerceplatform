import NextLink from "next/link";
import {
	ChevronRight,
	CreditCard,
	MapPin,
	Palette,
	UserRound,
} from "lucide-react";
import { Container } from "@/shared";
import { NotificationSettingsPanel, ProfileHeader } from "@/features/account";

const quickLinks = [
	{
		href: "/profile/account",
		label: "Account details",
		description: "Name, email and password",
		icon: UserRound,
	},
	{
		href: "/profile/appearance",
		label: "Appearance",
		description: "Light, dark or system mode",
		icon: Palette,
	},
	{
		href: "/profile/address",
		label: "Addresses",
		description: "Delivery details",
		icon: MapPin,
	},
	{
		href: "/profile/payment",
		label: "Payment & wallet",
		description: "Saved cards and store credit",
		icon: CreditCard,
	},
];

export const metadata = { title: "Settings" };

export default function ProfileSettingsPage() {
	return (
		<div>
			<ProfileHeader title='Settings' subtitle='Notifications and more' />

			<Container className='space-y-6'>
				<p className='text-sm text-muted-foreground'>
					Choose what updates you receive. These preferences are stored on this
					device.
				</p>

				<NotificationSettingsPanel />

				<section>
					<h2 className='px-1 pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
						More settings
					</h2>

					<ul className='divide-y divide-border/80 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
						{quickLinks.map(
							({ href, label, description, icon: Icon }) => (
								<li key={href}>
									<NextLink
										href={href}
										className='flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/5 active:bg-muted/10'>
										<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary'>
											<Icon className='size-4' aria-hidden />
										</span>

										<span className='min-w-0 flex-1'>
											<span className='block text-sm font-medium text-foreground'>
												{label}
											</span>
											<span className='block truncate text-xs text-muted-foreground'>
												{description}
											</span>
										</span>

										<ChevronRight
											className='size-4 shrink-0 text-muted-foreground'
											aria-hidden
										/>
									</NextLink>
								</li>
							),
						)}
					</ul>
				</section>
			</Container>
		</div>
	);
}
