"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button, formatCurrency } from "@/shared";
import type { SavedItem } from "../types";

type SavedItemRowProps = {
	item: SavedItem;
};

export function SavedItemRow({ item }: SavedItemRowProps) {
	const hasImage = Boolean(item.imageUrl);

	return (
		<article className='group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md'>
			<div className='flex gap-3'>
				<div className='relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 via-background to-brand-200 ring-1 ring-brand-100'>
					{hasImage ? (
						<img
							src={item.imageUrl}
							alt={item.name}
							className='h-full w-full object-cover'
						/>
					) : (
						<Heart className='size-7 text-brand-700' />
					)}
					<span className='absolute left-2 top-2 rounded-full bg-white/85 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-brand-700 shadow-sm'>
						Saved
					</span>
				</div>

				<div className='flex min-w-0 flex-1 flex-col justify-between gap-3'>
					<div className='flex items-start justify-between gap-2'>
						<div className='min-w-0'>
							<p className='mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
								Saved item
							</p>
							<h3 className='line-clamp-2 text-sm font-semibold leading-5 text-foreground'>
								{item.name}
							</h3>
						</div>

						<Button
							type='button'
							variant='ghost'
							size='icon-sm'
							className='rounded-full text-muted-foreground hover:bg-muted hover:text-danger'
							aria-label='Remove from saved'
							onClick={() => console.log("hello")}>
							<Trash2 className='size-4' />
						</Button>
					</div>

					<div className='flex items-end justify-between gap-3'>
						<div className='flex flex-col'>
							<span className='text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
								Price
							</span>
							<span className='text-base font-bold text-primary'>
								{formatCurrency(item.price)}
							</span>
						</div>

						<Button
							type='button'
							variant='outline'
							size='sm'
							className='gap-2 rounded-full border-border/80 bg-background/80 px-3 font-medium shadow-sm transition-colors hover:bg-brand-50 hover:text-brand-700'
							onClick={() => console.log("hello")}>
							<ShoppingCart className='size-4' />
							Add to cart
						</Button>
					</div>
				</div>
			</div>
		</article>
	);
}
