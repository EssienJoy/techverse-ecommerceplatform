"use client";

import { Download, ShoppingCart } from "lucide-react";
import { Button, Container, siteConfig } from "@/shared";
import Link from "next/link";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useCartUIStore } from "@/features/cart/stores/useCartUIStore";

export function Header() {
	const cartCount = useCartStore((state) => state.totalCartItems);
	const toggleCart = useCartUIStore((state) => state.toggleCart);

	return (
		<header>
			<Container className='flex items-center justify-between py-6'>
				<Link
					href='/'
					className='text-xl
      text-foreground-primary font-bold tracking-tight'>
					{siteConfig.name}
				</Link>
				<div className='flex items-center gap-1'>
					<Button variant='ghost' size='icon-lg' aria-label='Download'>
						<Download />
					</Button>
					<button
						type='button'
						onClick={toggleCart}
						aria-label='Cart'
						className='relative flex size-9 items-center justify-center rounded-lg text-foreground transition-all hover:bg-muted'>
						<ShoppingCart className='size-4' />
						<span className='absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white'>
							{cartCount}
						</span>
					</button>
				</div>
			</Container>
		</header>
	);
}
