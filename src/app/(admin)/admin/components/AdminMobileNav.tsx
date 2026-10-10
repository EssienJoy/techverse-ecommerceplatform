import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	UserRound,
} from "lucide-react";
import { Link } from "@/shared";

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Products", href: "/admin/products", icon: Package },
	{ label: "Orders", href: "/admin/orders", icon: ShoppingCart },
	{ label: "Customers", href: "/admin/customers", icon: Users },
	{ label: "Profile", href: "/admin/profile", icon: UserRound },
];

export function AdminMobileNav() {
	return (
		<nav className='fixed bottom-0 left-0 z-50 w-full rounded-t-3xl bg-card p-2 shadow-2xl md:hidden'>
			<ul className='flex items-center justify-between gap-1'>
				{navItems.map(({ label, href, icon: Icon }) => (
					<li key={label}>
						<Link
							href={href}
							className='flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
						>
							<Icon className='size-5' />
							<span className='text-xs font-medium'>{label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
