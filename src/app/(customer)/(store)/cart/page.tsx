"use client";

import { Header } from "../_components";
import { Cart } from "@/app/(customer)/(store)/cart";
import { useCartStore } from "@/shared/store/useCartStore";

export default function CartPage() {
	const count = useCartStore((state) =>
		state.cart.reduce((sum, item) => sum + item.qty, 0),
	);

	return (
		<>
			<Header text='Cart' number={String(count)} isCart={false} showBack={false} />
			<section>
				<Cart />
			</section>
		</>
	);
}