"use client";

import { ChevronLeft, Menu, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Container } from "@/shared";
import { useCartStore } from "@/shared/store/useCartStore";
import { useCartUIStore } from "@/shared/store/useCartUIStore";

type HeaderProps = {
	text: string;
	isCart?: boolean;
	number?: string;
	showBack?: boolean;
	showMenu?: boolean;
	onMenuClick?: () => void;
};

export function Header({
	text,
	isCart = true,
	number,
	showBack = true,
	showMenu = false,
	onMenuClick,
}: HeaderProps) {
	const router = useRouter();
	const cartCount = useCartStore((state) =>
		state.cart.reduce((sum, item) => sum + item.qty, 0),
	);
	const clearCart = useCartStore((state) => state.clearCart);
	const toggleCart = useCartUIStore((state) => state.toggleCart);

	return (
		<header className='py-4'>
			<Container className='grid grid-cols-3 items-center'>
				<div className='flex justify-start'>
					{showMenu ? (
						<Button
							variant='ghost'
							size='icon'
							aria-label='Browse categories'
							aria-expanded={Boolean(onMenuClick)}
							className='rounded-full border border-border/80 bg-background text-foreground shadow-sm transition-transform active:scale-95'
							onClick={onMenuClick}>
							<Menu className='size-5' />
						</Button>
					) : showBack ? (
						<Button
							variant='ghost'
							size='icon'
							aria-label='Go back'
							className='rounded-full border border-border/80 bg-background text-foreground shadow-sm transition-transform active:scale-95'
							onClick={() => router.back()}>
							<ChevronLeft className='size-5' />
						</Button>
					) : null}
				</div>

				<div className='text-center'>
					<h1 className='text-lg font-bold leading-tight tracking-tight'>
						{text}
					</h1>
					{number ? (
						<p className='text-[11px] font-medium text-muted-foreground'>
							{number} {number === "1" ? "item" : "items"}
						</p>
					) : null}
				</div>

				<div className='flex justify-end'>
					{isCart ? (
						<button
							type='button'
							onClick={toggleCart}
							aria-label='Cart'
							className='relative flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted'>
							<ShoppingCart className='size-4' />
							<span className='absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white'>
								{cartCount}
							</span>
						</button>
					) : (
						<Button
							variant='ghost'
							size='sm'
							className='text-sm text-muted-foreground hover:text-danger'
							disabled={cartCount === 0}
							onClick={clearCart}>
							Clear All
						</Button>
					)}
				</div>
			</Container>
		</header>
	);
}