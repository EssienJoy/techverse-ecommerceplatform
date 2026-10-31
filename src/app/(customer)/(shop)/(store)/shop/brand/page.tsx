import type { Metadata } from "next";
import { Container, Link } from "@/shared";
import { Header } from "@/features/navigation";
import { getBrands } from "@/features/content/server/content.service";

export const metadata: Metadata = {
	title: "Shop by brand",
	description: "Browse every TechNest brand in one place.",
};

export default async function BrandsPage() {
	const brands = await getBrands();

	return (
		<>
			<Header text='Brands' showBack={false} showSaved />
			<section className='pb-12'>
				<Container>
					<div className='my-6 grid grid-cols-2 gap-3 sm:grid-cols-3'>
						{brands.map((brand) => (
							<Link
								key={brand.id}
								href={`/shop/brand/${brand.slug}`}
								className='rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground capitalize transition-colors hover:border-primary hover:text-primary'>
								{brand.name}
							</Link>
						))}
					</div>
				</Container>
			</section>
		</>
	);
}
