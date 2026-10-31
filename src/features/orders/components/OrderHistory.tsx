"use client";

import NextLink from "next/link";
import { Package, Truck } from "lucide-react";
import { EmptyState, formatCurrency } from "@/shared";
import { useOrderStore } from "../stores/useOrderStore";

const dateFormatter = new Intl.DateTimeFormat("en", {
	day: "numeric",
	month: "short",
	year: "numeric",
});

export function OrderHistory() {
	const orders = useOrderStore((state) => state.orders);

	if (orders.length === 0) {
		return (
			<EmptyState
				icon={Package}
				title='No orders yet'
				description='When you place an order it will appear here with its delivery status.'
				actionLabel='Start shopping'
				actionHref='/shop'
			/>
		);
	}

	return (
		<ul className='space-y-2'>
			{orders.map((order) => {
				const itemCount = order.items.reduce(
					(sum, item) => sum + item.qty,
					0,
				);
				const preview = order.items
					.slice(0, 2)
					.map((item) => item.name)
					.join(", ");
				const more = order.items.length > 2 ? ` +${order.items.length - 2}` : "";

				return (
					<li
						key={order.id}
						className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
						<div className='flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								<p className='text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase'>
									Order
								</p>
								<p className='truncate text-sm font-semibold text-foreground'>
									{order.id}
								</p>
								<p className='mt-1 text-xs text-muted-foreground'>
									{dateFormatter.format(new Date(order.placedAt))} ·{" "}
									{itemCount} {itemCount === 1 ? "item" : "items"}
								</p>
							</div>

							<span className='shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-medium text-brand-700'>
								Processing
							</span>
						</div>

						<p className='mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
							{preview}
							{more}
						</p>

						<div className='mt-3 flex items-center justify-between border-t border-border/80 pt-3'>
							<span className='text-sm font-bold text-primary'>
								{formatCurrency(order.total)}
							</span>

							<NextLink
								href={`/track/${order.id}`}
								className='inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary'>
								<Truck className='size-3.5' aria-hidden />
								Track order
							</NextLink>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
