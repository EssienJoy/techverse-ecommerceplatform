import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { Container, Link } from "@/shared";
import {
	categoryIcons,
	type CategoryIconKey,
	type ContentCategory,
} from "@/features/content/lib/category";

type CategoryItem = {
	id: string;
	label: string;
	slug: string;
	imageUrl?: string;
	icon?: CategoryIconKey;
};

/** Shown when a category has no image yet, so the chip is never a blank circle. */
function CategoryGlyph({ icon }: { icon?: CategoryIconKey }) {
	const Icon = icon ? categoryIcons[icon] : LayoutGrid;

	return <Icon className='size-5 text-primary' aria-hidden />;
}

export function Categories({ categories }: { categories: ContentCategory[] }) {
	const items: CategoryItem[] = [
		{ id: "all", label: "All", slug: "" },
		...categories.map((category) => ({
			id: category.id,
			label: category.label,
			slug: category.slug,
			imageUrl: category.imageUrl || undefined,
			icon: category.icon,
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
								href={item.slug ? `/shop/category/${item.slug}` : "/shop"}
								className='flex w-16 flex-col items-center gap-2'>
								<span className='relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-white'>
									{item.imageUrl ? (
										<Image
											src={item.imageUrl}
											alt={item.label}
											width={88}
											height={88}
											className='h-full w-full object-contain p-2'
										/>
									) : (
										<CategoryGlyph icon={item.icon} />
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
