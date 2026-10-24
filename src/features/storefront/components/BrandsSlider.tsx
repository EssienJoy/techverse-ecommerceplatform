"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Link } from "@/shared";
import type { ContentBrand } from "@/features/content/lib/brand";

export function BrandsSlider({ brands }: { brands: ContentBrand[] }) {
	const scrollerRef = useRef<HTMLUListElement>(null);

	const scroll = (direction: 1 | -1) => {
		const scroller = scrollerRef.current;
		if (!scroller) return;

		scroller.scrollBy({
			left: direction * Math.max(scroller.clientWidth * 0.75, 240),
			behavior: "smooth",
		});
	};

	return (
		<div className='flex items-center gap-2'>
			<div className='relative min-w-0 flex-1'>
				<ul
					ref={scrollerRef}
					className='flex items-center overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{brands.map((brand) => (
						<li key={brand.id} className='shrink-0'>
							<Link
								href={`/shop/brand/${brand.slug}`}
								aria-label={`Shop ${brand.name}`}
								title={brand.name}
								className='flex h-11 items-center justify-center px-3 opacity-60 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 sm:px-4'>
								{brand.logoUrl ? (
									<Image
										src={brand.logoUrl}
										alt={brand.name}
										width={160}
										height={160}
										sizes='110px'
										className='h-6 w-auto max-w-24 object-contain sm:h-8'
									/>
								) : (
									<span className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
										{brand.name}
									</span>
								)}
							</Link>
						</li>
					))}
				</ul>
				<span className='pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent' />
				<span className='pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent' />
			</div>

			<div className='flex shrink-0 gap-0.5'>
				<Button
					type='button'
					variant='ghost'
					size='icon-sm'
					aria-label='Scroll brands left'
					onClick={() => scroll(-1)}>
					<ChevronLeft />
				</Button>
				<Button
					type='button'
					variant='ghost'
					size='icon-sm'
					aria-label='Scroll brands right'
					onClick={() => scroll(1)}>
					<ChevronRight />
				</Button>
			</div>
		</div>
	);
}
