import { Images, LayoutGrid, Tag, Zap } from "lucide-react";
import { Link } from "@/shared";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	getAllBrands,
	getAllCategories,
	getAllHeroSlides,
	getFlashSaleAdmin,
} from "@/features/content/server/content.service";
import { PageHeader } from "@/features/admin";
import { AdminHeader } from "@/features/admin/components/AdminHeader";

export default async function AdminContentPage() {
	const [categories, brands, heroSlides, flashSale] = await Promise.all([
		getAllCategories(),
		getAllBrands(),
		getAllHeroSlides(),
		getFlashSaleAdmin(),
	]);

	const sections = [
		{
			title: "Hero slides",
			href: "/admin/content/hero",
			icon: Images,
			description: "The rotating banners at the top of the home page.",
			count: `${heroSlides.length} slides`,
		},
		{
			title: "Categories",
			href: "/admin/content/categories",
			icon: LayoutGrid,
			description: "The categories products are grouped into.",
			count: `${categories.length} categories`,
		},
		{
			title: "Brands",
			href: "/admin/content/brands",
			icon: Tag,
			description: "Brands customers can browse and filter by.",
			count: `${brands.length} brands`,
		},
		{
			title: "Flash sale",
			href: "/admin/content/flash-sale",
			icon: Zap,
			description: "Time-limited discounts shown on the home page.",
			count: flashSale?.isActive ? "Live" : "Off",
		},
	];

	return (
		<>
			<AdminHeader title='Content' />
			<div className='flex flex-1 flex-col gap-6 p-gutter pb-24'>
				<PageHeader description='Manage everything shoppers see on the storefront.' />

				<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{sections.map(({ title, href, icon: Icon, description, count }) => (
						<Link key={href} href={href} className='block'>
							<Card className='h-full transition-shadow hover:shadow-md'>
								<CardHeader>
									<span className='flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700 ring-1 ring-brand-300/60'>
										<Icon className='size-5' />
									</span>
									<CardTitle className='mt-3'>{title}</CardTitle>
									<CardDescription>{description}</CardDescription>
									<span className='mt-2 text-xs font-medium text-muted-foreground'>
										{count}
									</span>
								</CardHeader>
							</Card>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
