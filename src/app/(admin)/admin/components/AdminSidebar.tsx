"use client";

import {
	LayoutDashboard,
	Package,
	Settings,
	ShoppingCart,
	Users,
} from "lucide-react";
import { Link, siteConfig } from "@/shared";

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Products", href: "/admin/products", icon: Package },
	{ label: "Orders", href: "/admin/orders", icon: ShoppingCart },
	{ label: "Customers", href: "/admin/customers", icon: Users },
	{ label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
	return (
		<aside className='hidden w-60 shrink-0 border-r border-border bg-card p-4 md:flex md:flex-col'>
			<Link href='/admin' className='flex items-center gap-2 px-3'>
				<span className='text-lg font-bold tracking-tight'>
					{siteConfig.name}
				</span>
				<span className='text-xs font-medium text-muted-foreground'>
					Admin
				</span>
			</Link>
			<nav className='mt-8'>
				<ul className='flex flex-col gap-1'>
					{navItems.map(({ label, href, icon: Icon }) => (
						<li key={label}>
							<Link
								href={href}
								className='flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted'
							>
								<Icon className='size-4' />
								{label}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
