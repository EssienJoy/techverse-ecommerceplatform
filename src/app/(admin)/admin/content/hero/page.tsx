import { getAllHeroSlides } from "@/features/content/server/content.service";
import { HeroManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function HeroContentPage() {
	const slides = await getAllHeroSlides();

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-4 pb-24 md:p-6'>
				<ContentNav />
				<PageHeader
					title='Hero slides'
					description='The rotating banners at the top of the home page.'
				/>
				<HeroManager slides={slides} />
			</div>
		</>
	);
}
