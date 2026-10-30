"use client";

import { ChevronLeft, Heart, Menu, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Container } from "@/shared";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useCartUIStore } from "@/features/cart/stores/useCartUIStore";
import { useFavoritesStore } from "@/features/saved/stores/useFavoritesStore";

type HeaderProps = {
	text: string;
	isCart?: boolean;
	saved?: boolean;
	showSaved?: boolean;
	number?: string;
	showBack?: boolean;
	backHref?: string;
	showMenu?: boolean;
	onMenuClick?: () => void;
};

export function Header({
	text,
	isCart = true,
	saved = false,
	showSaved = false,
	number,
	showBack = true,
	backHref,
	showMenu = false,
	onMenuClick,
}: HeaderProps) {
	const router = useRouter();
	const cartCount = useCartStore((state) => state.totalCartItems);
	const clearCart = useCartStore((state) => state.clearCart);
	const toggleCart = useCartUIStore((state) => state.toggleCart);
	const savedCount = useFavoritesStore((state) => state.favorites.length);
	const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

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
					) : saved ? (
						<Button
							variant='ghost'
							size='sm'
							className='text-sm text-muted-foreground hover:text-danger'
							disabled={savedCount === 0}
							onClick={clearFavorites}>
							Clear All
						</Button>
					) : showSaved ? (
						<Link
							href='/saved'
							aria-label='Saved'
							className='relative flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted'>
							<Heart className='size-4' />
							<span className='absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white'>
								{savedCount}
							</span>
						</Link>
					) : showBack && backHref ? (
						<Link
							href={backHref}
							aria-label='Go back'
							className='flex size-9 items-center justify-center rounded-full border border-border/80 bg-background text-foreground shadow-sm transition-transform active:scale-95'>
							<ChevronLeft className='size-5' />
						</Link>
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

				<div className='flex items-center justify-end gap-1'>
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
