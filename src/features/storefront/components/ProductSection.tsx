import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container, Link } from "@/shared";

type ProductSectionProps = {
	title: string;
	href?: string;
	children: ReactNode;
};

export function ProductSection({ title, href, children }: ProductSectionProps) {
	return (
		<section className='my-6'>
			<Container>
				<div className='flex items-center justify-between'>
					<h2 className='text-lg font-bold'>{title}</h2>
					{href ? (
						<Link
							href={href}
							className='inline-flex items-center gap-0.5 text-sm font-medium'>
							See all
							<ChevronRight className='size-4' />
						</Link>
					) : null}
				</div>
				<div
					className='mt-3 flex snap-x snap-mandatory gap-2
				 overflow-x-auto [scrollbar-width:none]
				  [&::-webkit-scrollbar]:hidden'>
					{children}
				</div>
			</Container>
		</section>
	);
}
