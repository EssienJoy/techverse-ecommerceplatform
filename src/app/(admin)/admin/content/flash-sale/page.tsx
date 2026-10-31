import { getFlashSaleAdmin } from "@/features/content/server/content.service";
import { getProducts } from "@/features/products/server/products.service";
import { MAX_PRODUCT_PAGE_SIZE } from "@/features/products/lib/pagination";
import { FlashSaleManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function FlashSaleContentPage() {
	const [flashSale, productPage] = await Promise.all([
		getFlashSaleAdmin(),
		getProducts({ limit: MAX_PRODUCT_PAGE_SIZE, includeInactive: true }),
	]);

	const products = productPage.products;

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
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
