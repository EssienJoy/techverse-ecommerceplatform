import Image from "next/image";
import { Package } from "lucide-react";
import { Container, Link, formatCurrency } from "@/shared";
import type { Product } from "@/features/products/schema";
import {
	LOW_STOCK_LIMIT,
	getLowestStockVariation,
} from "@/features/products/lib/stock";

export function LimitedStock({ products }: { products: Product[] }) {
	const lowStock = products
		.flatMap((product) => {
			const variation = getLowestStockVariation(product.variations);

			return variation ? [{ product, variation }] : [];
		})
		.sort((a, b) => a.variation.stock - b.variation.stock)
		.slice(0, 10);

	if (lowStock.length === 0) return null;

	return (
		<section className='py-1'>
			<Container>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						{/* <span className='flex size-7 items-center justify-center rounded-lg bg-danger-muted text-danger-foreground'>
							<Flame className='size-4' />
						</span> */}
						<h2 className='text-lg font-bold'>Limited Stocks</h2>
					</div>
					<Link href='/shop?filter=low-stock' className='text-sm font-medium'>
						See all
					</Link>
				</div>
				<ul className='mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{lowStock.map(({ product, variation }) => {
						const pct = Math.max(
							8,
							Math.round((variation.stock / LOW_STOCK_LIMIT) * 100),
						);
						return (
							<li key={product.id} className='w-36 shrink-0'>
								<Link
									href={`/shop?product=${product.slug}`}
									className='flex flex-col rounded-2xl border border-border bg-card p-2 transition-shadow hover:shadow-md'>
									<div className='relative flex h-20 items-center justify-center overflow-hidden rounded-xl bg-white text-brand-500'>
										{product.imageUrl ? (
											<Image
												src={product.imageUrl}
												alt={product.name}
												width={288}
												height={288}
												className='size-full object-contain'
											/>
										) : (
											<Package className='size-6' />
										)}
									</div>
									<h3 className='mt-2 line-clamp-2 text-[0.6875rem] font-medium'>
										{product.name}
									</h3>
									<span className='line-clamp-1 text-[0.625rem] text-muted-foreground'>
										{variation.color} · {variation.size}
									</span>
									<span className='mt-1 text-sm font-bold text-primary'>
										{formatCurrency(product.price)}
									</span>
									<div className='mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted'>
										<div
											className='h-full rounded-full bg-gradient-to-r from-amber-400 to-danger'
											style={{ width: `${pct}%` }}
										/>
									</div>
									<span className='mt-1.5 flex items-center gap-1 text-[0.625rem] font-semibold text-danger'>
										<span className='size-1.5 animate-pulse rounded-full bg-danger' />
										Only {variation.stock} left
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</Container>
		</section>
	);
}
