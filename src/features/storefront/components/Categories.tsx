import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { Container, Link } from "@/shared";
import { getCategories } from "@/features/content/server/content.service";

const DEFAULT_CATEGORY_IMAGE = "/hero.jpg";

type CategoryItem = {
	id: string;
	label: string;
	slug: string;
	imageUrl: string;
};

export async function Categories() {
	const categories = await getCategories();
	const items: CategoryItem[] = [
		{ id: "all", label: "All", slug: "", imageUrl: "" },
		...categories.map((category) => ({
			id: category.id,
			label: category.label,
			slug: category.slug,
			imageUrl: category.imageUrl ?? "",
		})),
	];

	return (
		<section className='my-6'>
			<Container>
				<ul
					className='flex gap-2 
				overflow-x-auto  [scrollbar-width:none] 
				[&::-webkit-scrollbar]:hidden'>
					{items.map((item) => (
						<li key={item.id} className='shrink-0'>
							<Link
								href={item.slug ? `/shop?category=${item.slug}` : "/shop"}
								className='flex w-16 flex-col items-center gap-1.5'>
								<span className='relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-white'>
									{item.id === "all" ? (
										<LayoutGrid className='size-5 text-primary' />
									) : (
										<Image
											src={item.imageUrl || DEFAULT_CATEGORY_IMAGE}
											alt={item.label}
											width={88}
											height={88}
											className='h-full w-full object-contain p-1.5'
										/>
									)}
								</span>
								<span className='text-center text-xs text-foreground'>
									{item.label}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
