import { getFlashSaleAdmin } from "@/features/content/server/content.service";
import { getProducts } from "@/features/products/server/products.service";
import { FlashSaleManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function FlashSaleContentPage() {
	const [flashSale, products] = await Promise.all([
		getFlashSaleAdmin(),
		getProducts(),
	]);

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<ContentNav />
				<PageHeader
					title='Flash sale'
					description='Time-limited discounts shown on the home page.'
				/>
				<FlashSaleManager
					flashSale={flashSale}
					products={products.map((product) => ({
						id: product.id,
						name: product.name,
						price: product.price,
					}))}
				/>
			</div>
		</>
	);
}
