import { getAllBrands } from "@/features/content/server/content.service";
import { BrandsManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function BrandsContentPage() {
	const brands = await getAllBrands();

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<ContentNav />
				<PageHeader
					title='Brands'
					description='Brands shoppers can browse and filter products by.'
				/>
				<BrandsManager brands={brands} />
			</div>
		</>
	);
}
