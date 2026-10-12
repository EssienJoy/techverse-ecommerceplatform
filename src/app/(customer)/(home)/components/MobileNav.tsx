"use client";

import {
	Heart,
	Home,
	Settings,
	ShoppingBag,
	ShoppingCart,
} from "lucide-react";
import { Link } from "@/shared";
import { useCartStore } from "@/shared/store/useCartStore";
import { useFavoritesStore } from "@/shared/store/useFavoritesStore";

export function MobileNav() {
	const cartCount = useCartStore((state) =>
		state.cart.reduce((sum, item) => sum + item.qty, 0),
	);
	const savedCount = useFavoritesStore((state) => state.favorites.length);

	const countFor = (href: string) =>
		href === "/saved" ? savedCount : href === "/cart" ? cartCount : 0;

	const navItems = [
		{ label: "Home", href: "/", icon: Home },
		{ label: "Saved", href: "/saved", icon: Heart },
		{ label: "Shop", href: "/shop", icon: ShoppingBag },
		{ label: "Cart", href: "/cart", icon: ShoppingCart },
		{ label: "Settings", href: "/settings", icon: Settings },
	];

	return (
		<nav
			className='fixed w-full bottom-0 left-0 z-50 rounded-t-3xl
		 bg-card p-2 shadow-2xl md:hidden '>
			<ul className='justify-between flex items-center gap-1'>
				{navItems.map(({ label, href, icon: Icon }) => {
					const count = countFor(href);
					const displayLabel = href === "/cart" && count > 0 ? `Cart(${count})` : label;
					return (
						<li key={label}>
							<Link
								href={href}
								className='flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
								<span className='relative'>
									<Icon className='size-5' />
									{(href === "/cart" || count > 0) && (
										<span className='absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white'>
											{count}
										</span>
									)}
								</span>
								<span className='text-xs font-medium'>{displayLabel}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}