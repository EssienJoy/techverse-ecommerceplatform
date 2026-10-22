import { Container } from "@/shared";
import type { ContentBrand } from "@/features/content/lib/brand";
import { BrandsSlider } from "./BrandsSlider";

export function Brands({ brands }: { brands: ContentBrand[] }) {
	if (brands.length === 0) return null;

	return (
		<section className='my-6'>
			<Container>
				<BrandsSlider brands={brands} />
			</Container>
		</section>
	);
}
