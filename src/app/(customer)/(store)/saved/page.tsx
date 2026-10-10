import { products } from "@/features/products";
import { SavedItemRow } from "@/features/saved";
import type { SavedItem } from "@/features/saved";
import { Container } from "@/shared";
import { Header } from "../components";

const demoSaved: SavedItem[] = [
	{
		id: "s1",
		productId: products[1].id,
		name: products[1].name,
		price: products[1].price,
		imageUrl: products[1].imageUrl,
	},
	{
		id: "s2",
		productId: products[6].id,
		name: products[6].name,
		price: products[6].price,
		imageUrl: products[6].imageUrl,
	},
	{
		id: "s3",
		productId: products[7].id,
		name: products[7].name,
		price: products[7].price,
		imageUrl: products[7].imageUrl,
	},
];

export default function SavedPage() {
	return (
		<>
			<Header text='Saved' />
			<section>
				<Container>
					{demoSaved.length === 0 ? (
						<p className='mt-2 text-muted-foreground'>No saved items yet.</p>
					) : (
						<div className='mt-4 flex flex-col gap-3'>
							{demoSaved.map((item) => (
								<SavedItemRow key={item.id} item={item} />
							))}
						</div>
					)}
				</Container>
			</section>
		</>
	);
}
