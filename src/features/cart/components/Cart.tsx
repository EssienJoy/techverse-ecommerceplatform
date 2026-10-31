"use client";

import { useMemo } from "react";
import { Button, Container, EmptyState, Skeleton } from "@/shared";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useProductsByIds } from "@/features/products";
import { resolveCartItem } from "../lib/resolveCartItem";
import { CartItemRow } from "./CartItemRow";
import { CartSummary } from "./CartSummary";

export function Cart() {
	const cart = useCartStore((state) => state.cart);
	const removeFromCart = useCartStore((state) => state.removeFromCart);
	const productIds = useMemo(
		() => cart.map((item) => item.productId),
		[cart],
	);
	const { productsById, isLoading } = useProductsByIds(productIds);

	const items = cart.flatMap((line) => {
		const product = productsById.get(line.productId);

		return product ? [resolveCartItem(line, product)] : [];
	});
	const missing = cart.filter((line) => !productsById.has(line.productId));
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);

	return (
		<Container className='pb-2'>
			{cart.length === 0 ? (
				<div className=''>
					<EmptyState
						icon={ShoppingCart}
						title='Your cart is empty'
						description="Looks like you haven't added anything yet. Explore the shop and find something you love."
						actionLabel='Start shopping'
						actionHref='/shop'
					/>
				</div>
			) : (
				<div className='grid gap-6'>
					<section className='space-y-3'>
						<div className='flex items-center justify-between px-1'>
							<h2 className='text-sm font-semibold text-foreground'>
								Your items
							</h2>
							<span className='text-xs text-muted-foreground'>
								{itemCount} {itemCount === 1 ? "item" : "items"}
							</span>
						</div>

						{items.map((item) => (
							<CartItemRow
								key={item.variationId ?? item.productId}
								item={item}
							/>
						))}

						{missing.length > 0
							? missing.map((line) => (
									<div
										key={line.variationId ?? line.productId}
										className='flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4'>
										{isLoading ? (
											<div className='flex w-full items-center gap-3'>
												<Skeleton className='size-20 shrink-0 rounded-xl' />
												<div className='flex flex-1 flex-col gap-2'>
													<Skeleton className='h-4 w-2/3 rounded-full' />
													<Skeleton className='h-4 w-1/3 rounded-full' />
												</div>
											</div>
										) : (
											<>
												<p className='text-sm text-muted-foreground'>
													This product is no longer available.
												</p>
												<Button
													type='button'
													variant='outline'
													size='sm'
													onClick={() =>
														removeFromCart(
															line.variationId ?? line.productId,
														)
													}>
													Remove
												</Button>
											</>
										)}
									</div>
								))
							: null}
					</section>

					<section>
						<CartSummary subtotal={subtotal} />
					</section>
				</div>
			)}
		</Container>
	);
}
