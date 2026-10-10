import { products } from "@/features/products";
import { CartItemRow, CartSummary } from "@/features/cart";
import type { CartItem } from "@/features/cart";
import { Header } from "../components";
import { Container } from "@/shared";

const demoCart: CartItem[] = [
	{
		productId: products[0].id,
		name: products[0].name,
		price: products[0].price,
		imageUrl: products[0].imageUrl,
		quantity: 1,
	},
	{
		productId: products[4].id,
		name: products[4].name,
		price: products[4].price,
		imageUrl: products[4].imageUrl,
		quantity: 2,
	},
	{
		productId: products[7].id,
		name: products[7].name,
		price: products[7].price,
		imageUrl: products[7].imageUrl,
		quantity: 1,
	},
];

const subtotal = demoCart.reduce(
	(sum, item) => sum + item.price * item.quantity,
	0,
);

export default function CartPage() {
	return (
		<>
			<Header text='Cart' number='3' isCart={false} />
			<section className=''>
				<Container>
					{demoCart.length === 0 ? (
						<p className='mt-2 text-muted-foreground'>Your cart is empty.</p>
					) : (
						<div className='mt-6 grid gap-5 '>
							<section className='space-y-2'>
								{demoCart.map((item) => (
									<CartItemRow key={item.productId} item={item} />
								))}
							</section>

							<section className=''>
								<CartSummary subtotal={subtotal} />
							</section>
						</div>
					)}
				</Container>
			</section>
		</>
	);
}
