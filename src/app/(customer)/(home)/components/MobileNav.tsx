import {
	Heart,
	Home,
	MessageCircle,
	ShoppingBag,
	ShoppingCart,
} from "lucide-react";
import { Link } from "@/shared";

export function MobileNav() {
	const navItems = [
		{ label: "Home", href: "/", icon: Home },
		{ label: "Saved", href: "/saved", icon: Heart },
		{ label: "Shop", href: "/shop", icon: ShoppingBag },
		{ label: "Cart", href: "/cart", icon: ShoppingCart },
		{ label: "Contact", href: "/contact", icon: MessageCircle },
	];
	return (
		<nav
			className='fixed w-full bottom-0 left-0 z-50 rounded-t-3xl
		 bg-card p-2 shadow-2xl md:hidden '>
			<ul className='justify-between flex items-center gap-1'>
				{navItems.map(({ label, href, icon: Icon }) => (
					<li key={label}>
						<Link
							href={href}
							className='flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
							<Icon className='size-5' />
							<span className='text-xs font-medium'>{label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
