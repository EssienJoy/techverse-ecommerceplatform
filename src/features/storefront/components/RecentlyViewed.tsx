import Image from "next/image";
import { History, Package } from "lucide-react";
import { Container, Link, formatCurrency } from "@/shared";
import { resolveShopperOwner } from "@/features/cart/server/customer-user";
import { getRecentlyViewed } from "@/features/history/server/history.service";

/** Reads the visitor's session, so render it inside a <Suspense> boundary. */
export async function RecentlyViewed() {
	const owner = await resolveShopperOwner({ create: false, admin: "none" });
	const recentlyViewed = await getRecentlyViewed(owner);

	if (recentlyViewed.length === 0) return null;

	return (
		<section className='my-6'>
			<Container>
				<div className='flex items-center gap-2'>
					<span className='flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-600'>
						<History className='size-4' />
					</span>
					<h2 className='text-lg font-bold'>Recently Viewed</h2>
				</div>
				<ul className='mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{recentlyViewed.map((product) => (
						<li key={product.id} className='w-28 shrink-0'>
							<Link
								href={`/product/${product.id}`}
								className='group flex flex-col'>
								<div className='flex h-24 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white text-brand-400 transition-colors group-hover:border-brand-200'>
									{product.imageUrl ? (
										<Image
											src={product.imageUrl}
											alt={product.name}
											width={224}
											height={192}
											className='size-full object-contain'
										/>
									) : (
										<Package className='size-6' />
									)}
								</div>
								<h3 className='mt-1.5 line-clamp-2 text-[0.6875rem] font-medium text-foreground-subtle'>
									{product.name}
								</h3>
								<span className='mt-0.5 text-xs font-bold text-primary'>
									{formatCurrency(product.price)}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
