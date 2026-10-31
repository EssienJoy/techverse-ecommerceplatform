"use client";

import Link from "next/link";
import { formatCurrency } from "@/shared";
import { ChevronDown } from "lucide-react";
import { useCheckoutOrder } from "../lib/useCheckoutOrder";

function Row({
	label,
	value,
	emphasis = false,
}: {
	label: string;
	value: string;
	emphasis?: boolean;
}) {
	return (
		<div className='flex items-center justify-between text-sm'>
			<span
				className={
					emphasis
						? "font-semibold text-foreground"
						: "text-muted-foreground"
				}>
				{label}
			</span>
			<span
				className={
					emphasis
						? "text-base font-bold text-foreground"
						: "font-medium text-foreground"
				}>
				{value}
			</span>
		</div>
	);
}

export function CheckoutSummary() {
	const { items, hasUnavailableProducts, subtotal, shipping, tax, total } =
		useCheckoutOrder();
	const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

	return (
		<details className='group mt-4 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
			<summary className='flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden'>
				<span className='flex min-w-0 items-center gap-2'>
					<span className='truncate text-sm font-semibold text-foreground'>
						Order summary
					</span>
					{itemCount > 0 && (
						<span className='shrink-0 rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground'>
							{itemCount} {itemCount === 1 ? "item" : "items"}
						</span>
					)}
				</span>
				<span className='flex shrink-0 items-center gap-2'>
					<span className='text-base font-bold text-foreground'>
						{formatCurrency(total)}
					</span>
					<ChevronDown
						className='size-4 text-muted-foreground transition-transform group-open:rotate-180'
						aria-hidden
					/>
				</span>
			</summary>

			<div className='border-t border-border px-4 py-4'>
				{hasUnavailableProducts && (
					<p className='mb-3 rounded-xl bg-danger-muted px-3 py-2 text-xs text-danger-foreground'>
						Some cart products are no longer available. Remove them from your
						cart to continue.
					</p>
				)}

				{items.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						No items in your cart yet.{" "}
						<Link
							href='/shop'
							className='font-medium text-primary underline-offset-2 hover:underline'>
							Browse products
						</Link>
					</p>
				) : (
					<ul className='space-y-3'>
						{items.map((item, index) => (
							<li
								key={`${item.productId}-${index}`}
								className='flex items-start justify-between gap-3 text-sm'>
								<span className='line-clamp-2 text-foreground'>
									{item.name || "Unavailable item"}{" "}
									<span className='text-muted-foreground'>× {item.qty}</span>
								</span>
								<span className='shrink-0 font-medium text-foreground'>
									{formatCurrency(item.price * item.qty)}
								</span>
							</li>
						))}
					</ul>
				)}

				<div className='mt-4 space-y-2 border-t border-border pt-4'>
					<Row label='Subtotal' value={formatCurrency(subtotal)} />
					<Row
						label='Shipping'
						value={shipping === 0 ? "Free" : formatCurrency(shipping)}
					/>
					<Row label='Estimated tax' value={formatCurrency(tax)} />
					<div className='border-t border-border pt-2'>
						<Row label='Total' value={formatCurrency(total)} emphasis />
					</div>
				</div>
			</div>
		</details>
	);
}
