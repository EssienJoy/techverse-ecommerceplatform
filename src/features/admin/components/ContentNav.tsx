"use client";

import { usePathname } from "next/navigation";
import { Images, LayoutGrid, Tag, Zap } from "lucide-react";
import { cn } from "cn";
import { Link } from "@/shared";

const items = [
	{ label: "Hero", href: "/admin/content/hero", icon: Images },
	{ label: "Categories", href: "/admin/content/categories", icon: LayoutGrid },
	{ label: "Brands", href: "/admin/content/brands", icon: Tag },
	{ label: "Flash sale", href: "/admin/content/flash-sale", icon: Zap },
];

export function ContentNav() {
	const pathname = usePathname();

	return (
		<nav className='flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
			{items.map(({ label, href, icon: Icon }) => {
				const active = pathname === href;

				return (
					<Link
						key={href}
						href={href}
						aria-current={active ? "page" : undefined}
						className={cn(
							"inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
							active
								? "border-primary bg-primary text-foreground-inverse"
								: "border-border bg-card text-muted-foreground hover:text-foreground",
						)}>
						<Icon
							className={cn(
								"size-4",
								active ? "text-foreground-inverse" : "text-primary",
							)}
						/>
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
