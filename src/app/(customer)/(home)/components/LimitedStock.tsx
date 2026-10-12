import { Flame, Package } from "lucide-react";
import { products } from "@/app/(customer)/(store)/product";
import { Container, Link, formatCurrency } from "@/shared";

const MAX_STOCK = 15;

const lowStock = products
	.filter((product) => product.stock <= MAX_STOCK)
	.sort((a, b) => a.stock - b.stock)
	.slice(0, 4);

export function LimitedStock() {
	return (
		<section className='py-4'>
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
				<ul className='mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{lowStock.map((product) => {
						const pct = Math.max(
							8,
							Math.round((product.stock / MAX_STOCK) * 100),
						);
						return (
							<li key={product.id} className='w-36 shrink-0'>
								<Link
									href={`/shop?product=${product.slug}`}
									className='flex flex-col rounded-2xl border border-border bg-card p-2 transition-shadow hover:shadow-md'>
									<div className='relative flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500'>
										<Package className='size-6' />
									</div>
									<h3 className='mt-2 line-clamp-2 text-[0.6875rem] font-medium'>
										{product.name}
									</h3>
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
										Only {product.stock} left
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
