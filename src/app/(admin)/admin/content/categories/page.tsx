import { getAllCategories } from "@/features/content/server/content.service";
import { CategoriesManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function CategoriesContentPage() {
	const categories = await getAllCategories();

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<ContentNav />
				<PageHeader
					title='Categories'
					description='The categories products are grouped into and shoppers browse by.'
				/>
				<CategoriesManager categories={categories} />
			</div>
		</>
	);
}
