"use client";

import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button, formatCurrency } from "@/shared";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import type { CartItem } from "@/shared";

type CartItemRowProps = {
	item: CartItem;
};

export function CartItemRow({ item }: CartItemRowProps) {
	const increaseQty = useCartStore((state) => state.increaseQty);
	const decreaseQty = useCartStore((state) => state.decreaseQty);
	const removeFromCart = useCartStore((state) => state.removeFromCart);

	return (
		<Link
			href={`/product/${item.productId}`}
			className='flex gap-2 rounded-2xl border border-border bg-card p-3'>
			<div
				className='relative flex h-20 w-20 shrink-0 overflow-hidden
			 items-center justify-center rounded-xl bg-white text-brand-700'>
				{item.imageUrl ? (
					<Image
						src={item.imageUrl}
						alt={item.name}
						fill
						sizes='80px'
						className='object-contain'
					/>
				) : (
					<ShoppingBag className='size-6' />
				)}
			</div>
			<section className='flex flex-1 flex-col justify-between gap-1'>
				<div className='flex items-start justify-between gap-2'>
					<div className='min-w-0'>
						<h3 className='text-sm font-medium'>{item.name}</h3>
						{item.color || item.size ? (
							<p className='text-xs text-muted-foreground'>
								{[item.color, item.size].filter(Boolean).join(" · ")}
							</p>
						) : null}
					</div>
					<Button
						type='button'
						variant='ghost'
						size='icon-sm'
						aria-label='Remove from cart'
						onClick={(event) => {
							event.preventDefault();
							event.stopPropagation();
							removeFromCart(item.variationId ?? item.productId);
						}}>
						<Trash2 className='size-4' />
					</Button>
				</div>
				<p className='text-xs text-muted-foreground'>
					{formatCurrency(item.price)} each
				</p>
				<div className='flex items-center justify-between'>
					<span className='text-sm font-bold text-primary'>
						{formatCurrency(item.price * item.quantity)}
					</span>
					<div className='flex items-center gap-1'>
						<Button
							type='button'
							variant='outline'
							size='icon-sm'
							aria-label='Decrease quantity'
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								decreaseQty(item.variationId ?? item.productId);
							}}>
							<Minus />
						</Button>
						<span className='w-6 text-center text-sm font-medium'>
							{item.quantity}
						</span>
						<Button
							type='button'
							variant='outline'
							size='icon-sm'
							aria-label='Increase quantity'
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								increaseQty(item.variationId ?? item.productId);
							}}>
							<Plus />
						</Button>
					</div>
				</div>
			</section>
		</Link>
	);
}
