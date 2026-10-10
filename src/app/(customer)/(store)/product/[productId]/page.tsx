import Image from "next/image";
import { products } from "@/features/products";
import { Button, Container, formatCurrency } from "@/shared";
import { Heart, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { Header } from "../../components";

export default async function ProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;
	const product = products.find((item) => item.id === productId);

	if (!product) {
		notFound();
	}

	const stockLabel =
		product.stock <= 10 ? `${product.stock} left in stock` : "In stock";

	return (
		<>
			<Header text='Product' />
			<section className='pb-12'>
				<Container>
					<div className='mt-4 overflow-hidden rounded-[32px] border border-border bg-card p-3 shadow-sm sm:p-4'>
						<div className='grid gap-5 lg:grid-cols-[1.05fr_0.95fr]'>
							<div className='rounded-[28px] border border-border/80 bg-gradient-to-br from-brand-100 via-background to-brand-200 p-4'>
								<div className='relative flex h-[320px] items-center justify-center overflow-hidden rounded-[24px] border border-white/50 bg-white/60 sm:h-[420px]'>
									{product.imageUrl ? (
										<Image
											src={product.imageUrl}
											alt={product.name}
											width={1200}
											height={1200}
											className='h-full w-full object-cover'
										/>
									) : (
										<div className='flex h-full w-full items-center justify-center text-brand-700'>
											<ShoppingBag className='size-14' />
										</div>
									)}

									<div className='absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-sm'>
										Featured
									</div>

									<button
										type='button'
										aria-label='Save product'
										className='absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/85 text-muted-foreground shadow-sm transition-colors hover:text-danger'>
										<Heart className='size-4' />
									</button>
								</div>
							</div>

							<div className='flex flex-col justify-center p-2 sm:p-3'>
								<p className='text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'>
									{product.slug.replace("-", " ")}
								</p>
								<h1 className='mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
									{product.name}
								</h1>

								<div className='mt-3 flex items-center gap-2 text-sm text-muted-foreground'>
									<div className='flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-600'>
										<Star className='fill-current size-3.5' />
										<span className='font-medium'>
											{product.rating.toFixed(1)}
										</span>
									</div>
									<span>({product.reviews} reviews)</span>
									<span className='h-1 w-1 rounded-full bg-border'></span>
									<span className='text-emerald-600'>{stockLabel}</span>
								</div>

								<div className='mt-5 flex items-end gap-3'>
									<span className='text-3xl font-bold text-primary'>
										{formatCurrency(product.price)}
									</span>
									{product.price > 200 ? (
										<span className='pb-1 text-sm text-muted-foreground line-through'>
											{formatCurrency(product.price * 1.15)}
										</span>
									) : null}
								</div>

								<p className='mt-5 text-base leading-7 text-muted-foreground'>
									{product.description}
								</p>

								<div className='mt-6 flex flex-col gap-3 sm:flex-row'>
									<Button className='flex-1 gap-2 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90'>
										<ShoppingBag className='size-4' />
										Add to cart
									</Button>
									<Button
										variant='outline'
										className='flex-1 rounded-full border-border/80 bg-background'>
										Buy now
									</Button>
								</div>

								<div className='mt-6 grid gap-3 sm:grid-cols-3'>
									<div className='rounded-2xl border border-border bg-muted/40 p-3'>
										<div className='flex items-center gap-2 text-sm font-medium text-foreground'>
											<Truck className='size-4 text-brand-600' />
											Delivery
										</div>
										<p className='mt-2 text-xs text-muted-foreground'>
											Free shipping over $300
										</p>
									</div>
									<div className='rounded-2xl border border-border bg-muted/40 p-3'>
										<div className='flex items-center gap-2 text-sm font-medium text-foreground'>
											<ShieldCheck className='size-4 text-emerald-600' />
											Warranty
										</div>
										<p className='mt-2 text-xs text-muted-foreground'>
											2-year manufacturer warranty
										</p>
									</div>
									<div className='rounded-2xl border border-border bg-muted/40 p-3'>
										<div className='flex items-center gap-2 text-sm font-medium text-foreground'>
											<Star className='size-4 text-amber-500' />
											Quality
										</div>
										<p className='mt-2 text-xs text-muted-foreground'>
											Top-rated by verified shoppers
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]'>
						<div className='rounded-[28px] border border-border bg-card p-5 sm:p-6'>
							<p className='text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
								Description
							</p>
							<h2 className='mt-2 text-2xl font-semibold text-foreground'>
								Why shoppers love it
							</h2>
							<div className='mt-4 space-y-4 text-sm leading-7 text-muted-foreground'>
								<p>
									This product pairs performance, comfort, and everyday
									practicality in a way that fits both work and life.
								</p>
								<p>
									Built for reliability and convenience, it balances premium
									materials with smart features that make daily use feel
									effortless.
								</p>
							</div>
						</div>

						<div className='rounded-[28px] border border-border bg-card p-5 sm:p-6'>
							<p className='text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
								Highlights
							</p>
							<ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
								<li className='flex items-center gap-2'>
									<span className='h-2 w-2 rounded-full bg-brand-600'></span>
									High-performance design
								</li>
								<li className='flex items-center gap-2'>
									<span className='h-2 w-2 rounded-full bg-brand-600'></span>
									Premium build quality
								</li>
								<li className='flex items-center gap-2'>
									<span className='h-2 w-2 rounded-full bg-brand-600'></span>
									Fast delivery and easy returns
								</li>
							</ul>
						</div>
					</div>
				</Container>
			</section>
		</>
	);
}
