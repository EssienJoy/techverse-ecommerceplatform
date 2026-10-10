import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { cn } from "cn";
import { Button } from "./Button";
import { formatCurrency } from "../lib";
import type { ProductSummary } from "../types";

type ProductCardProps = {
	product: ProductSummary;
	oldPrice?: number;
	className?: string;
};

export function ProductCard({
	product,
	oldPrice,
	className,
}: ProductCardProps) {
	const isTopRated =
		typeof product.rating === "number" && product.rating >= 4.7;

	return (
		<article
			className={cn(
				"group flex flex-col justify-between overflow-hidden rounded-[26px] border border-border/80 bg-card p-2.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md",
				className,
			)}>
			<section>
				<div className='relative flex h-40 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200 text-brand-700'>
					{product.imageUrl ? (
						<Image
							src={product.imageUrl}
							alt={product.name}
							width={640}
							height={640}
							className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
						/>
					) : (
						<ShoppingBag className='size-8' />
					)}

					{isTopRated ? (
						<span className='absolute left-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700 shadow-sm'>
							Top rated
						</span>
					) : null}

					<button
						type='button'
						aria-label='Add to favorites'
						className='absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/85 text-muted-foreground shadow-sm backdrop-blur transition-all hover:scale-105 hover:text-danger'>
						<Heart className='size-4' />
					</button>
				</div>

				<div className='px-1 pb-1 pt-3'>
					<h3 className='line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-foreground'>
						{product.name}
					</h3>

					{typeof product.rating === "number" ? (
						<div className='mt-2 flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Star className='size-3.5 fill-amber-400 text-amber-400' />
							<span className='font-medium text-foreground'>
								{product.rating.toFixed(1)}
							</span>
							{typeof product.reviews === "number" ? (
								<span>({product.reviews})</span>
							) : null}
						</div>
					) : null}

					<div className='mt-3 flex items-end gap-2'>
						<span className='text-lg font-bold text-primary'>
							{formatCurrency(product.price)}
						</span>
						{oldPrice ? (
							<span className='pb-0.5 text-xs text-muted-foreground line-through'>
								{formatCurrency(oldPrice)}
							</span>
						) : null}
					</div>
				</div>
			</section>

			<Button
				className='mt-3 w-full rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'
				size='sm'>
				<ShoppingBag className='size-3.5' />
				Add to cart
			</Button>
		</article>
	);
}
