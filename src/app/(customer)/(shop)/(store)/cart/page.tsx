"use client";

import { Header } from "@/features/navigation";
import { Cart } from "@/features/cart";
import { useCartStore } from "@/features/cart/stores/useCartStore";

export default function CartPage() {
	const count = useCartStore((state) =>
		state.cart.reduce((sum, item) => sum + item.qty, 0),
	);

	return (
		<>
			<Header
				text='Cart'
				number={String(count)}
				isCart={false}
				showBack={false}
				showSaved
			/>
			<section>
				<Cart />
			</section>
		</>
	);
}
