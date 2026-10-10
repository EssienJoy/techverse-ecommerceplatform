import {
	BatteryCharging,
	Cable,
	Headphones,
	Headset,
	LayoutGrid,
	Laptop,
	Monitor,
	PlugZap,
	Smartphone,
	Tablet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Link } from "@/shared";

type Category = {
	label: string;
	icon: LucideIcon;
};

const categories: Category[] = [
	{ label: "All", icon: LayoutGrid },
	{ label: "Phones", icon: Smartphone },
	{ label: "Laptops", icon: Laptop },
	{ label: "Powerbanks", icon: BatteryCharging },
	{ label: "Charger", icon: PlugZap },
	{ label: "Cords", icon: Cable },
	{ label: "Ear piece", icon: Headphones },
	{ label: "Headsets", icon: Headset },
	{ label: "Tabs", icon: Tablet },
	{ label: "Computer", icon: Monitor },
	{ label: "Ear pods", icon: Headphones },
];

export function Categories() {
	return (
		<section className='py-4'>
			<Container>
				<ul
					className='flex gap-1 
				overflow-x-auto pb-2 [scrollbar-width:none] 
				[&::-webkit-scrollbar]:hidden'>
					{categories.map(({ label, icon: Icon }) => (
						<li key={label} className='shrink-0'>
							<Link
								href={
									label === "All"
										? "/shop"
										: `/shop?category=${label.toLowerCase().replace(/\s+/g, "-")}`
								}
								className='flex w-16 flex-col items-center gap-1.5'>
								<span className='flex size-11 items-center justify-center rounded-full bg-white text-brand-600'>
									<Icon className='size-5' />
								</span>
								<span className='text-center text-xs text-foreground'>
									{label}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
