import type { ReactNode } from "react";
import { Container, Link } from "@/shared";

type ProductSectionProps = {
	title: string;
	href?: string;
	children: ReactNode;
};

export function ProductSection({ title, href, children }: ProductSectionProps) {
	return (
		<section className='py-2'>
			<Container>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-bold'>{title}</h2>
					{href ? (
						<Link href={href} className='text-sm font-medium'>
							See all
						</Link>
					) : null}
				</div>
				<div
					className='mt-3 flex snap-x snap-mandatory gap-1
				 overflow-x-auto pb-2 [scrollbar-width:none]
				  [&::-webkit-scrollbar]:hidden'>
					{children}
				</div>
			</Container>
		</section>
	);
}
