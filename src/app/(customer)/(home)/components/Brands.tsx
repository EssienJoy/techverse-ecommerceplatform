import { Boxes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container, Link } from "@/shared";

type Brand = {
	label: string;
	icon?: LucideIcon;
};

const brands: Brand[] = [
	{ label: "All", icon: Boxes },
	{ label: "Apple" },
	{ label: "Samsung" },
	{ label: "Xiaomi" },
	{ label: "Oppo" },
	{ label: "Tecno" },
	{ label: "Infinix" },
	{ label: "HP" },
	{ label: "Dell" },
	{ label: "Lenovo" },
	{ label: "Anker" },
];

export function Brands() {
	return (
		<section className='py-4'>
			<Container>
				<ul className='flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{brands.map(({ label, icon: Icon }) => (
						<li key={label} className='shrink-0'>
							<Link
								href={
									label === "All"
										? "/shop"
										: `/shop?brand=${label.toLowerCase()}`
								}
								className='flex w-16 flex-col items-center gap-1.5'
							>
								<span className='flex size-11 items-center justify-center rounded-full bg-white text-brand-600'>
									{Icon ? (
										<Icon className='size-5' />
									) : (
										<span className='text-sm font-semibold uppercase'>
											{label.charAt(0)}
										</span>
									)}
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
