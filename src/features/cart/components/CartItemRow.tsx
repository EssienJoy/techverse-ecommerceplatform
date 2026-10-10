"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2Icon } from "lucide-react";
import { cn } from "cn";
import { Button, formatCurrency } from "@/shared";
import type { CartItem } from "../types";
import Link from "next/link";
import Image from "next/image";

type CartItemRowProps = {
	item: CartItem;
	onQuantityChange?: (productId: string, quantity: number) => void;
};

export function CartItemRow({ item, onQuantityChange }: CartItemRowProps) {
	const [favorite, setFavorite] = useState(false);

	return (
		<Link
			href={`product/1`}
			className='flex gap-3 rounded-2xl border border-border bg-card p-3'>
			<div
				className='relative flex h-20 w-20 shrink-0 overflow-hidden
			 items-center justify-center rounded-xl bg-gradient-to-br
			  from-brand-100 to-brand-300 text-brand-700'>
				<Image src='/hero.jpg' alt={`hero.jpg`} fill className='object-cover' />
			</div>
			<section className='flex flex-1 flex-col justify-between gap-1'>
				<div className='flex items-start justify-between gap-2'>
					<h3 className='text-sm font-medium'>{item.name}</h3>
					<Button
						variant='ghost'
						size='icon-sm'
						aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
						aria-pressed={favorite}
						onClick={() => setFavorite((prev) => !prev)}>
						<Trash2Icon className={cn(favorite && "fill-danger text-danger")} />
					</Button>
				</div>
				<p className='text-xs'>loremmmmmmmm</p>
				<div className='flex items-center justify-between'>
					<span className='text-sm font-bold text-primary'>
						{formatCurrency(item.price)}
					</span>
					<div className='flex items-center gap-1'>
						<Button
							variant='outline'
							size='icon-sm'
							aria-label='Decrease quantity'
							onClick={() =>
								onQuantityChange?.(item.productId, item.quantity - 1)
							}>
							<Minus />
						</Button>
						<span className='w-6 text-center text-sm font-medium'>
							{item.quantity}
						</span>
						<Button
							variant='outline'
							size='icon-sm'
							aria-label='Increase quantity'
							onClick={() =>
								onQuantityChange?.(item.productId, item.quantity + 1)
							}>
							<Plus />
						</Button>
					</div>
				</div>
			</section>
		</Link>
	);
}
