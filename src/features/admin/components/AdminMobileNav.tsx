"use client";

import {
	ChartNoAxesCombined,
	LayoutDashboard,
	LayoutTemplate,
	Package,
	Settings,
	ShoppingCart,
	UserRound,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Link } from "@/shared";

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
	{ label: "Products", href: "/admin/products", icon: Package },
	{ label: "Orders", href: "/admin/orders", icon: ShoppingCart },
	{ label: "Customers", href: "/admin/customers", icon: Users },
	{ label: "Content", href: "/admin/content", icon: LayoutTemplate },
	{ label: "Settings", href: "/admin/settings", icon: Settings },
	{ label: "Profile", href: "/admin/profile", icon: UserRound },
];

const isActivePath = (pathname: string, href: string) =>
	href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

export function AdminMobileNav() {
	const pathname = usePathname();

	return (
		<nav className='fixed bottom-0 left-0 z-50 w-full rounded-t-3xl bg-card p-2 shadow-2xl sm:hidden'>
			<ul className='flex items-center justify-between gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				{navItems.map(({ label, href, icon: Icon }) => {
					const active = isActivePath(pathname, href);

					return (
						<li key={href} className='shrink-0'>
							<Link
								href={href}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex w-16 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors",
									active
										? "bg-accent font-semibold text-accent-foreground"
										: "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
								)}>
								<Icon
									className={cn("size-5 shrink-0", active && "text-primary")}
								/>
								<span className='w-full truncate text-center text-[11px] font-medium'>
									{label}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
