import { Container, Link } from "@/shared";
import { getBrands } from "@/features/content/server/content.service";

export async function Brands() {
	const brands = await getBrands();

	return (
		<section>
			<Container>
				<ul
					className='flex gap-2 overflow-x-auto py-6
				 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{brands.map(({ id, name }) => (
						<li key={id} className='shrink-0'>
							<Link
								href={`/shop?brand=${name.toLowerCase()}`}
								className='rounded-full
								capitalize border border-border/80 bg-primary px-4 py-1.5 text-sm font-medium text-foreground-inverse shadow-sm transition-colors hover:bg-primary/90'>
								{name}
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}
