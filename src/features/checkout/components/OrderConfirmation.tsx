"use client";

import { useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/shared";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useOrderStore } from "@/features/orders/stores/useOrderStore";
import type { Order } from "@/features/orders/schema";
import { useCheckoutStore } from "../stores/useCheckoutStore";
import { CheckCircle2 } from "lucide-react";

/**
 * The order was already paid on Stripe. Clearing the cart and saving the order
 * are browser-side follow-ups, so they run here rather than during rendering.
 */
export function OrderConfirmation({ order }: { order: Order }) {
	const addOrder = useOrderStore((state) => state.addOrder);
	const alreadySaved = useOrderStore((state) =>
		state.orders.some((item) => item.id === order.id),
	);
	const cartCount = useCartStore((state) => state.cart.length);
	const clearCart = useCartStore((state) => state.clearCart);
	const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

	useEffect(() => {
		if (!alreadySaved) addOrder(order);
		if (cartCount > 0) clearCart();
		clearCheckout();
	}, [alreadySaved, order, addOrder, cartCount, clearCart, clearCheckout]);

	return (
		<div className='mt-10 flex flex-col items-center text-center'>
			<span className='flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
				<CheckCircle2 className='size-8' />
			</span>
			<h2 className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
				Order placed successfully!
			</h2>
			<p className='mt-2 max-w-sm text-sm text-muted-foreground'>
				Order{" "}
				<span className='font-medium text-foreground'>{order.id}</span> ·{" "}
				{formatCurrency(order.total)}
			</p>
			<Link
				href={`/track/${order.id}`}
				className='mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-foreground-inverse transition-all hover:bg-primary/80'>
				Track your order
			</Link>
			<Link
				href='/shop'
				className='mt-3 inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-medium text-foreground transition-colors hover:border-primary'>
				Continue shopping
			</Link>
		</div>
	);
}
