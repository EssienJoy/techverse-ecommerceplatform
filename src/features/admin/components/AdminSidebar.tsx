"use client";

import {
	ChartNoAxesCombined,
	LayoutDashboard,
	LayoutTemplate,
	Package,
	PanelLeftClose,
	PanelLeftOpen,
	Settings,
	ShoppingCart,
	UserRound,
	Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "cn";
import { Link, siteConfig } from "@/shared";
import { useAdminNavStore } from "../stores/useAdminNavStore";
import { LogoutButton } from "./LogoutButton";

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

export function AdminSidebar() {
	const pathname = usePathname();
	const isCollapsed = useAdminNavStore((state) => state.isCollapsed);
	const toggle = useAdminNavStore((state) => state.toggle);

	return (
		<aside
			className={cn(
				"sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card py-4 transition-all duration-200 sm:flex lg:w-64 lg:px-3",
				isCollapsed ? "w-16 px-2" : "w-64 px-3",
			)}>
			<div
				className={cn(
					"flex items-center",
					isCollapsed
						? "flex-col gap-2 lg:flex-row lg:justify-between lg:gap-2 lg:px-1.5"
						: "justify-between gap-2 px-1.5",
				)}>
				<Link href='/admin' className='flex items-center gap-2.5'>
					<span className='flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-foreground-inverse'>
						{siteConfig.name.charAt(0)}
					</span>
					<span
						className={cn(
							"flex flex-col leading-tight",
							isCollapsed && "hidden lg:flex",
						)}>
						<span className='text-sm font-bold tracking-tight'>
							{siteConfig.name}
						</span>
						<span className='text-xs text-muted-foreground'>Admin console</span>
					</span>
				</Link>

				<button
					type='button'
					onClick={toggle}
					aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
					aria-expanded={!isCollapsed}
					className='flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden'>
					{isCollapsed ? (
						<PanelLeftOpen className='size-4' />
					) : (
						<PanelLeftClose className='size-4' />
					)}
				</button>
			</div>

			<nav
				className={cn(
					"flex flex-1 flex-col lg:mt-7",
					isCollapsed ? "mt-6" : "mt-7",
				)}>
				<p
					className={cn(
						"px-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						isCollapsed && "hidden lg:block",
					)}>
					Menu
				</p>
				<ul className='mt-3 flex flex-col gap-1'>
					{navItems.map(({ label, href, icon: Icon }) => {
						const active = isActivePath(pathname, href);

						return (
							<li key={href}>
								<Link
									href={href}
									aria-current={active ? "page" : undefined}
									aria-label={isCollapsed ? label : undefined}
									title={isCollapsed ? label : undefined}
									className={cn(
										"group relative flex items-center rounded-xl px-2.5 py-2 text-sm transition-colors",
										isCollapsed
											? "justify-center lg:justify-start lg:gap-3"
											: "gap-3",
										active
											? "bg-accent font-semibold text-accent-foreground"
											: "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
									)}>
									<span
										className={cn(
											"absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
											active ? "opacity-100" : "opacity-0",
											isCollapsed && "hidden lg:block",
										)}
									/>
									<Icon
										className={cn(
											"size-4 shrink-0 transition-colors",
											active
												? "text-primary"
												: "text-muted-foreground group-hover:text-foreground",
										)}
									/>
									<span className={cn(isCollapsed && "hidden lg:inline")}>
										{label}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>

			<div className='mt-4 border-t border-border pt-3'>
				<LogoutButton collapsed={isCollapsed} />
			</div>
		</aside>
	);
}
