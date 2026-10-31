"use client";

import NextLink from "next/link";
import { Heart, Package, ShoppingCart } from "lucide-react";
import { useOrderStore } from "@/features/orders/stores/useOrderStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";
import { useCartStore } from "@/features/cart/stores/useCartStore";

/**
 * Live counts for the dashboard. They come from the browser stores, so the
 * first paint shows zeros and fills in once hydrated.
 */
export function ProfileStats() {
	const orders = useOrderStore((state) => state.orders.length);
	const saved = useFavoritesStore((state) => state.favorites.length);
	const cart = useCartStore((state) => state.totalCartItems);

	const stats = [
		{ href: "/profile/orders", label: "Orders", value: orders, icon: Package },
		{
			href: "/profile/wishlist",
			label: "Wishlist",
			value: saved,
			icon: Heart,
		},
		{ href: "/cart", label: "In cart", value: cart, icon: ShoppingCart },
	];

	return (
		<ul className='grid grid-cols-3 gap-2'>
			{stats.map(({ href, label, value, icon: Icon }) => (
				<li key={label}>
					<NextLink
						href={href}
						className='flex flex-col items-center gap-1 rounded-2xl border border-border/80 bg-card px-2 py-3 text-center shadow-sm transition-colors hover:border-primary/40'>
						<Icon className='size-4 text-primary' aria-hidden />
						<span className='text-lg font-bold leading-none text-foreground'>
							{value}
						</span>
						<span className='text-[11px] text-muted-foreground'>{label}</span>
					</NextLink>
				</li>
			))}
		</ul>
	);
}
