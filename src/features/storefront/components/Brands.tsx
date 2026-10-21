import { Container } from "@/shared";
import { getBrands } from "@/features/content/server/content.service";
import { BrandsSlider } from "./BrandsSlider";

export async function Brands() {
	const brands = await getBrands();

	if (brands.length === 0) return null;

	return (
		<section className='my-6'>
			<Container>
				<BrandsSlider brands={brands} />
			</Container>
		</section>
	);
}
