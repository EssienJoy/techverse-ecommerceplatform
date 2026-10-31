import { getAllHeroSlides } from "@/features/content/server/content.service";
import { HeroManager } from "@/features/content/components";
import { ContentNav, PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function HeroContentPage() {
	const slides = await getAllHeroSlides();

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
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
