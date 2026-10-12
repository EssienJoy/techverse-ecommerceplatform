import { Container, Link } from "@/shared";

const brands = [
	"Apple",
	"Samsung",
	"Xiaomi",
	"Oppo",
	"Tecno",
	"Infinix",
	"HP",
	"Dell",
	"Lenovo",
	"Anker",
];

export function Brands() {
	return (
		<section className='py-4'>
			<Container>
				<ul className='flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{brands.map((label) => (
						<li key={label} className='shrink-0'>
							<Link
								href={`/shop?brand=${label.toLowerCase()}`}
								className='rounded-full border border-border/80 bg-primary px-4 py-1.5 text-sm font-medium text-foreground-inverse shadow-sm transition-colors hover:bg-primary/90'>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</Container>
		</section>
	);
}