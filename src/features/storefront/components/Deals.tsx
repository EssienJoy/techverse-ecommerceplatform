import { ArrowRight, ShoppingBag, Zap } from "lucide-react";
import { Container, Link, formatCurrency } from "@/shared";
import type { FlashSaleDeal } from "@/features/content/server/content.service";
import { DealCountdown } from "./DealCountdown";

export function Deals({ sale }: { sale: FlashSaleDeal | null }) {
	if (!sale) {
		return null;
	}

	return (
		<section className='py-1'>
			<Container>
				<div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-4 text-white shadow-brand'>
					<div className='pointer-events-none absolute -top-16 -right-12 size-40 rounded-full bg-brand-400/40 blur-3xl' />
					<div className='pointer-events-none absolute -bottom-20 -left-12 size-40 rounded-full bg-brand-500/30 blur-3xl' />

					<section
						className='relative flex items-center 
						mb-6 justify-between gap-3'>
						<div className='flex items-center gap-2.5'>
							<span className='flex size-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur'>
								<Zap className='size-5 fill-white' />
							</span>
							<div>
								<h2 className='text-base leading-tight font-extrabold tracking-tight'>
									Flash Sale
								</h2>
								<p className='text-[0.6875rem] text-white/70'>
									{sale.headline}
								</p>
							</div>
						</div>
						<DealCountdown />
					</section>

					<section className='relative mt-4 grid grid-cols-2 gap-2'>
						{sale.items.map(({ product, discount }) => {
							const oldPrice = Math.round(product.price / (1 - discount / 100));
							return (
								<Link
									key={product.id}
									href={`/shop?product=${product.slug}`}
									className='group flex flex-col overflow-hidden rounded-2xl bg-white p-2 text-foreground transition-transform hover:-translate-y-0.5'>
									<div className='relative flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-200 text-brand-500'>
										<ShoppingBag className='size-7' />
										<span className='absolute top-1.5 left-1.5 rounded-full bg-danger px-2 py-0.5 text-[0.625rem] font-bold text-white shadow-sm'>
											-{discount}%
										</span>
									</div>
									<h3 className='mt-2 line-clamp-2 text-[0.6875rem] font-medium'>
										{product.name}
									</h3>
									<div className='mt-1 flex items-baseline gap-1.5'>
										<span className='text-sm font-bold text-primary'>
											{formatCurrency(product.price)}
										</span>
										<span className='text-[0.6875rem] text-muted-foreground line-through'>
											{formatCurrency(oldPrice)}
										</span>
									</div>
								</Link>
							);
						})}
					</section>

					<Link
						href='/shop?section=flash-sale'
						className='relative flex 
						mt-6 items-center justify-center gap-1 rounded-xl
						 bg-white py-2 text-xs 
						font-bold text-brand-700 transition-colors hover:bg-white/90'>
						View all deals
						<ArrowRight className='size-3.5' />
					</Link>
				</div>
			</Container>
		</section>
	);
}
