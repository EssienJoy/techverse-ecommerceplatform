import { notFound } from "next/navigation";
import { getBrands, getCategories } from "@/features/content";
import { getProductForEdit } from "@/features/products/server/products.service";
import { EditProductForm, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [product, categories, brands] = await Promise.all([
		getProductForEdit(id),
		getCategories(),
		getBrands(),
	]);

	if (!product) notFound();

	return (
		<>
			<AdminHeader title='Edit product' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
				<PageHeader description={`Update "${product.name}".`} />

				<EditProductForm
					product={product}
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
