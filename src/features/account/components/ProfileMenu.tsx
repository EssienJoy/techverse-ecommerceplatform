import NextLink from "next/link";
import {
	ChevronRight,
	CreditCard,
	Heart,
	LifeBuoy,
	MapPin,
	Package,
	Palette,
	Settings,
	UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type MenuItem = {
	href: string;
	label: string;
	description: string;
	icon: LucideIcon;
};

type MenuGroup = {
	title: string;
	items: MenuItem[];
};

/**
 * The dashboard sections. They are grouped so the page stays a short overview
 * on a phone while still exposing every account area in one tap.
 */
const groups: MenuGroup[] = [
	{
		title: "Shopping",
		items: [
			{
				href: "/profile/orders",
				label: "My orders",
				description: "Track deliveries and buy again",
				icon: Package,
			},
			{
				href: "/profile/wishlist",
				label: "Wishlist",
				description: "Items you saved for later",
				icon: Heart,
			},
			{
				href: "/profile/address",
				label: "Addresses",
				description: "Where your orders are delivered",
				icon: MapPin,
			},
			{
				href: "/profile/payment",
				label: "Payment & wallet",
				description: "Saved cards and store credit",
				icon: CreditCard,
			},
		],
	},
	{
		title: "Account",
		items: [
			{
				href: "/profile/account",
				label: "Account overview",
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
				href: "/profile/settings",
				label: "Settings",
				description: "Notifications and preferences",
				icon: Settings,
			},
			{
				href: "/profile/support",
				label: "Support",
				description: "Contact us and get help",
				icon: LifeBuoy,
			},
		],
	},
];

export function ProfileMenu() {
	return (
		<div className='space-y-6'>
			{groups.map((group) => (
				<section key={group.title}>
					<h2 className='px-1 pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase'>
						{group.title}
					</h2>

					<ul className='divide-y divide-border/80 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
						{group.items.map(
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
			))}
		</div>
	);
}
