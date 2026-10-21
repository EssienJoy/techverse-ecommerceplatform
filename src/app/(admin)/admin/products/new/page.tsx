import { getBrands, getCategories } from "@/features/content";
import { NewProductForm, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function NewProductPage() {
	const [categories, brands] = await Promise.all([
		getCategories(),
		getBrands(),
	]);

	return (
		<>
			<AdminHeader title='Add product' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<PageHeader description='Create a product and its purchasable variations.' />

				<NewProductForm
					categories={categories.map((category) => ({
						id: category.id,
						label: category.label,
					}))}
					brands={brands.map((brand) => ({
						id: brand.id,
						label: brand.name,
					}))}
				/>
			</div>
		</>
	);
}
