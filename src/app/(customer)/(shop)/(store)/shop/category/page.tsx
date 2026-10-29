import type { Metadata } from "next";
import { Container, Link } from "@/shared";
import { Header } from "@/features/navigation";
import { getCategories } from "@/features/content/server/content.service";

export const metadata: Metadata = {
	title: "Shop by category",
	description: "Browse every TechNest category in one place.",
};

export default async function CategoriesPage() {
	const categories = await getCategories();

	return (
		<>
			<Header text='Categories' showBack={false} showSaved />
			<section className='pb-12'>
				<Container>
					<div className='my-4 grid grid-cols-2 gap-2 sm:grid-cols-3'>
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/shop/category/${category.slug}`}
								className='rounded-xl border border-border bg-card p-4 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary'>
								{category.label}
							</Link>
						))}
					</div>
				</Container>
			</section>
		</>
	);
}
