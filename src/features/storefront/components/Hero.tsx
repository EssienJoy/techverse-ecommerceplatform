import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/shared/components/ui/carousel";

import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Button } from "@/shared";
import { HeroDots } from "./HeroDots";
import type { HeroSlide } from "@/features/content/lib/banner";

export function Hero({ slides }: { slides: HeroSlide[] }) {
	if (slides.length === 0) {
		return null;
	}

	return (
		<section className='my-4'>
			<Carousel>
				<CarouselContent className='ml-0 gap-2'>
					{slides.map((slide, index) => (
						<CarouselItem key={slide.id} className='pl-0'>
							<AspectRatio
								ratio={4 / 3}
								className='overflow-hidden
								 shadow-lg shadow-brand-900/10 ring-1 ring-black/5'>
								<Image
									src={slide.imageUrl || "/hero.jpg"}
									alt={slide.title}
									fill
									priority={index === 0}
									className='object-cover'
								/>
								<div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent' />
								<div className='absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent' />
								<section
									className='absolute inset-0 flex flex-col justify-center
									 gap-3.5 px-5 text-white'>
									<span
										className='w-fit rounded-full bg-white/15
										 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.14em] 
										 uppercase ring-1 ring-white/25 backdrop-blur-sm'>
										{slide.tag}
									</span>
									<div className='flex flex-col gap-1.5'>
										<h2 className='max-w-[15rem] text-[1.75rem] leading-[1.12] font-extrabold tracking-tight'>
											{slide.title}
										</h2>
										<p className='max-w-[15rem] text-[0.8125rem] leading-relaxed text-white/80'>
											{slide.subtitle}
										</p>
									</div>
									<Button
										className='self-start'
										nativeButton={false}
										render={<Link href={slide.href || "/shop"} />}>
										Shop Now
										<ArrowRight
											data-icon='inline-end'
											className='transition-transform duration-200 group-hover/button:translate-x-0.5'
										/>
									</Button>
								</section>
							</AspectRatio>
						</CarouselItem>
					))}
				</CarouselContent>
				<HeroDots slides={slides} />
			</Carousel>
		</section>
	);
}
