"use client";

import { products } from "@/app/(customer)/(store)/product";
import { Container, EmptyState } from "@/shared";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/shared/store/useCartStore";
import type { CartItem } from "../types";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

export function Cart() {
	const cart = useCartStore((state) => state.cart);

	const subtotal = cart.reduce((sum, item) => {
		const product = products.find((p) => p.id === item.productId);
		return sum + (product ? product.price * item.qty : 0);
	}, 0);

	return (
		<Container>
			{cart.length === 0 ? (
				<div className='mt-6'>
				<EmptyState
					icon={ShoppingCart}
					title='Your cart is empty'
					description='Looks like you haven’t added anything yet. Explore the shop and find something you love.'
					actionLabel='Start shopping'
					actionHref='/shop'
				/>
			</div>
			) : (
				<div className='mt-6 grid gap-5'>
					<section className='space-y-2'>
						{cart.map((item) => {
							const product = products.find((p) => p.id === item.productId);
							if (!product) return null;

							const cartItem: CartItem = {
								productId: item.productId,
								name: product.name,
								price: product.price,
								imageUrl: product.imageUrl,
								quantity: item.qty,
							};

							return <CartItemRow key={item.productId} item={cartItem} />;
						})}
					</section>

					<section>
						<CartSummary subtotal={subtotal} />
					</section>
				</div>
			)}
		</Container>
	);
}