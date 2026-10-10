import { products } from "@/features/products";
import { Container, ProductCard } from "@/shared";
import { Header } from "../components";

const shopFilters = ["All", "Phones", "Audio", "Laptops", "Accessories"];

export default function ShopPage() {
	return (
		<>
			<Header text='Shop' />
			<section className='pb-12'>
				<Container>
					<div className='mt-4 overflow-hidden rounded-[28px] border border-border bg-gradient-to-r from-brand-50 via-white to-muted/60 p-5 shadow-sm md:p-7'>
						<div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
							<div className='max-w-xl'>
								<p className='text-[10px] font-medium uppercase tracking-[0.16em] text-brand-700'>
									Curated tech
								</p>
								<h2 className='mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
									Shop the latest essentials
								</h2>
								<p className='mt-3 max-w-md text-sm text-muted-foreground md:text-base'>
									Premium gadgets, everyday favorites, and deals selected for a
									smarter setup.
								</p>
							</div>

							<div className='grid gap-3 sm:grid-cols-3'>
								<div className='rounded-2xl border border-brand-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm'>
									<p className='text-[10px] uppercase tracking-[0.14em] text-muted-foreground'>
										Rating
									</p>
									<p className='mt-1 text-lg font-bold text-foreground'>
										4.8/5
									</p>
								</div>
								<div className='rounded-2xl border border-brand-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm'>
									<p className='text-[10px] uppercase tracking-[0.14em] text-muted-foreground'>
										Shipping
									</p>
									<p className='mt-1 text-lg font-bold text-foreground'>Free</p>
								</div>
								<div className='rounded-2xl border border-brand-100 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm'>
									<p className='text-[10px] uppercase tracking-[0.14em] text-muted-foreground'>
										Products
									</p>
									<p className='mt-1 text-lg font-bold text-foreground'>
										{products.length}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
						<div>
							<p className='text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground'>
								Browse
							</p>
							<h3 className='mt-1 text-xl font-semibold text-foreground'>
								Popular picks
							</h3>
						</div>

						<div className='flex flex-wrap gap-2'>
							{shopFilters.map((filter, index) => (
								<button
									type='button'
									key={filter}
									aria-pressed={index === 0}
									className={[
										"rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
										index === 0
											? "border-brand-200 bg-brand-50 text-brand-700"
											: "border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground",
									].join(" ")}>
									{filter}
								</button>
							))}
						</div>
					</div>

					<div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4'>
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</Container>
			</section>
		</>
	);
}
