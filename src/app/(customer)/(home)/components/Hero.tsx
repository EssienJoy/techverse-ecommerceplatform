import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button, Container, Link } from "@/shared";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/shared/components/ui/carousel";
import { HeroDots } from "./HeroDots";

const slides = [
	{
		id: "hero-new",
		tag: "New in",
		title: "New gadgets just landed",
		subtitle: "Phones, wearables and smart home tech — fresh in stock.",
	},
	{
		id: "hero-deals",
		tag: "Limited deal",
		title: "Deals you don't want to miss",
		subtitle: "Save big on this week's hand-picked tech.",
	},
	{
		id: "hero-essentials",
		tag: "Essentials",
		title: "Upgrade your everyday",
		subtitle: "Audio, accessories and essentials, all in one place.",
	},
];

export function Hero() {
	return (
		<section className='py-2'>
			<Container>
				<Carousel>
					<CarouselContent className='ml-0 gap-4'>
						{slides.map((slide, index) => (
							<CarouselItem key={slide.id} className='pl-0'>
								<AspectRatio
									ratio={4 / 3}
									className='overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ring-1 ring-black/5'
								>
									<Image
										src='/hero.jpg'
										alt={slide.title}
										fill
										priority={index === 0}
										className='object-cover'
									/>
									<div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent' />
									<div className='absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent' />
									<div className='absolute inset-0 flex flex-col justify-center gap-3.5 px-5 text-white'>
										<span className='w-fit rounded-full bg-white/15 px-3 py-1 text-[0.625rem] font-semibold tracking-[0.14em] uppercase ring-1 ring-white/25 backdrop-blur-sm'>
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
											render={<Link href='/shop' />}
											className='mt-0.5 w-fit rounded-full'
										>
											Shop Now
											<ArrowRight
												data-icon='inline-end'
												className='transition-transform duration-200 group-hover/button:translate-x-0.5'
											/>
										</Button>
									</div>
								</AspectRatio>
							</CarouselItem>
						))}
					</CarouselContent>
					<HeroDots slides={slides} />
				</Carousel>
			</Container>
		</section>
	);
}
