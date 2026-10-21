"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import { useCarousel } from "@/shared/components/ui/carousel";

type HeroDotsProps = {
	slides: { id: string; title: string }[];
};

export function HeroDots({ slides }: HeroDotsProps) {
	const { api } = useCarousel();
	const [active, setActive] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		const onSelect = () => setActive(api.selectedScrollSnap());

		api.on("select", onSelect);
		api.on("reInit", onSelect);

		return () => {
			api.off("select", onSelect);
			api.off("reInit", onSelect);
		};
	}, [api]);

	return (
		<div
			className='absolute bottom-4 left-1/2 z-20 flex 
	 mt-6	-translate-x-1/2 items-center gap-1.5'>
			{slides.map((slide, index) => (
				<button
					key={slide.id}
					type='button'
					aria-label={`Go to ${slide.title}`}
					aria-current={active === index}
					onClick={() => api?.scrollTo(index)}
					className={cn(
						"h-1.5 rounded-full transition-all duration-300",
						active === index
							? "w-5 bg-white"
							: "w-1.5 bg-white/50 hover:bg-white/80",
					)}
				/>
			))}
		</div>
	);
}
