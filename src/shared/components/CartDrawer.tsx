"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Minus,
	Plus,
	ShoppingBag,
	ShoppingCart,
	Trash2,
	X,
} from "lucide-react";
import { cn } from "cn";
import { formatCurrency } from "../lib";
import { products } from "../data/products";
import { useCartStore } from "../store/useCartStore";
import { useCartUIStore } from "../store/useCartUIStore";

export function CartDrawer() {
	const isOpen = useCartUIStore((state) => state.isOpen);
	const closeCart = useCartUIStore((state) => state.closeCart);
	const cart = useCartStore((state) => state.cart);
	const increaseQty = useCartStore((state) => state.increaseQty);
	const decreaseQty = useCartStore((state) => state.decreaseQty);
	const removeFromCart = useCartStore((state) => state.removeFromCart);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeCart();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [closeCart]);

	useEffect(() => {
		document.body.style.overflow = isOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const cartItems = cart.flatMap((item) => {
		const product = products.find((p) => p.id === item.productId);
		return product ? [{ product, quantity: item.qty }] : [];
	});

	const subtotal = cartItems.reduce(
		(sum, { product, quantity }) => sum + product.price * quantity,
		0,
	);
	const count = cart.reduce((sum, item) => sum + item.qty, 0);

	return (
		<div
			className={cn(
				"fixed inset-0 z-[60]",
				isOpen ? "pointer-events-auto" : "pointer-events-none",
			)}
			aria-hidden={!isOpen}>
			<div
				onClick={closeCart}
				className={cn(
					"absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
					isOpen ? "opacity-100" : "opacity-0",
				)}
			/>
			<aside
				role='dialog'
				aria-label='Shopping cart'
				className={cn(
					"absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-out",
					isOpen ? "translate-x-0" : "translate-x-full",
				)}>
				<header className='flex items-center justify-between border-b border-border px-4 py-4'>
					<div className='flex items-center gap-2'>
						<ShoppingCart className='size-5 text-primary' />
						<h2 className='text-base font-bold text-foreground'>Your cart</h2>
						<span className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
							{count}
						</span>
					</div>
					<button
						type='button'
						aria-label='Close cart'
						onClick={closeCart}
						className='flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
						<X className='size-5' />
					</button>
				</header>

				{cartItems.length === 0 ? (
					<div className='flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center'>
						<span className='flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
							<ShoppingCart className='size-7' />
						</span>
						<p className='text-sm font-medium text-foreground'>
							Your cart is empty
						</p>
						<p className='text-sm text-muted-foreground'>
							Add products to see them here.
						</p>
						<Link
							href='/shop'
							onClick={closeCart}
							className='mt-1 inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-foreground-inverse transition-colors hover:bg-primary/80'>
							Start shopping
						</Link>
					</div>
				) : (
					<>
						<div className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
							{cartItems.map(({ product, quantity }) => (
								<div
									key={product.id}
									className='flex gap-3 rounded-2xl border border-border bg-card p-3'>
									<div className='relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-brand-300 text-brand-700'>
										{product.imageUrl ? (
											<Image
												src={product.imageUrl}
												alt={product.name}
												fill
												sizes='64px'
												className='object-cover'
											/>
										) : (
											<ShoppingBag className='size-5' />
										)}
									</div>
									<div className='flex flex-1 flex-col justify-between gap-1'>
										<div className='flex items-start justify-between gap-2'>
											<h3 className='line-clamp-1 text-sm font-medium text-foreground'>
												{product.name}
											</h3>
											<button
												type='button'
												aria-label='Remove from cart'
												onClick={() => removeFromCart(product.id)}
												className='shrink-0 text-muted-foreground transition-colors hover:text-danger'>
												<Trash2 className='size-4' />
											</button>
										</div>
										<div className='flex items-center justify-between'>
											<span className='text-sm font-bold text-primary'>
												{formatCurrency(product.price * quantity)}
											</span>
											<div className='flex items-center gap-1'>
												<button
													type='button'
													aria-label='Decrease quantity'
													disabled={quantity <= 1}
													onClick={() => decreaseQty(product.id)}
													className='flex size-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary disabled:opacity-40'>
													<Minus className='size-3.5' />
												</button>
												<span className='w-6 text-center text-sm font-medium'>
													{quantity}
												</span>
												<button
													type='button'
													aria-label='Increase quantity'
													onClick={() => increaseQty(product.id)}
													className='flex size-7 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary'>
													<Plus className='size-3.5' />
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						<footer className='border-t border-border px-4 py-4'>
							<div className='flex items-center justify-between text-sm'>
								<span className='text-muted-foreground'>Subtotal</span>
								<span className='text-lg font-bold text-foreground'>
									{formatCurrency(subtotal)}
								</span>
							</div>
							<p className='mt-1 text-xs text-muted-foreground'>
								Shipping and taxes calculated at checkout.
							</p>
							<div className='mt-4 grid gap-2'>
								<Link
									href='/checkout'
									onClick={closeCart}
									className='inline-flex h-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-foreground-inverse transition-colors hover:bg-primary/80'>
									Checkout
								</Link>
								<Link
									href='/cart'
									onClick={closeCart}
									className='inline-flex h-11 items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors hover:border-primary'>
									View cart
								</Link>
							</div>
						</footer>
					</>
				)}
			</aside>
		</div>
	);
}