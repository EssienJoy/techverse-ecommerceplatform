"use client";

import { formatCurrency } from "@/shared";
import { useCheckoutOrder } from "../lib/useCheckoutOrder";

export function CheckoutSummary() {
	const { items, hasUnavailableProducts, subtotal, shipping, tax, total } =
		useCheckoutOrder();

	return (
		<section className='mt-6 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
			<div className='border-b border-border px-4 py-3'>
				<h2 className='text-lg font-bold tracking-tight text-foreground'>
					Order summary
				</h2>
			</div>
			<div className='px-4 py-4'>
				{hasUnavailableProducts ? (
					<p className='text-sm text-danger'>
						Some cart products are no longer available. Remove them from your
						cart to continue.
					</p>
				) : null}
				{items.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						No items in your cart yet.
					</p>
				) : (
					<div className='space-y-3'>
						{items.map((item, index) => (
							<div
								key={`${item.productId}-${index}`}
								className='flex items-center justify-between gap-3 text-sm'>
								<span className='line-clamp-1'>
									{item.name}{" "}
									<span className='text-muted-foreground'>× {item.qty}</span>
								</span>
								<span className='font-medium'>
									{formatCurrency(item.price * item.qty)}
								</span>
							</div>
						))}
					</div>
				)}

				<div className='mt-4 space-y-2 border-t border-border pt-4 text-sm'>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span>Subtotal</span>
						<span className='font-medium text-foreground'>
							{formatCurrency(subtotal)}
						</span>
					</div>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span>Shipping</span>
						<span className='font-medium text-foreground'>
							{shipping === 0 ? "Free" : formatCurrency(shipping)}
						</span>
					</div>
					<div className='flex items-center justify-between text-muted-foreground'>
						<span>Estimated tax</span>
						<span className='font-medium text-foreground'>
							{formatCurrency(tax)}
						</span>
					</div>
					<div className='flex items-center justify-between border-t border-border pt-3'>
						<span className='font-semibold text-foreground'>Total</span>
						<span className='text-2xl font-bold text-primary'>
							{formatCurrency(total)}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
