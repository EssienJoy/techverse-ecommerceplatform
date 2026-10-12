"use client";

import { Fragment } from "react";
import { cn } from "cn";
import { Container, EmptyState, formatCurrency } from "@/shared";
import { Header } from "../../_components";
import { useOrderStore } from "@/shared/store/useOrderStore";
import { CheckCircle2, Package, Truck } from "lucide-react";

const steps = [
	{ label: "Placed" },
	{ label: "Processing" },
	{ label: "Shipping" },
	{ label: "Delivered" },
];

export function TrackOrder({ orderId }: { orderId: string }) {
	const order = useOrderStore((state) =>
		state.orders.find((item) => item.id === orderId),
	);

	if (!order) {
		return (
			<>
				<Header text='Track order' />
				<section>
					<Container>
						<div className='mt-4'>
							<EmptyState
								icon={Package}
								title='Order not found'
								description={`We could not find an order with the id ${orderId}.`}
								actionLabel='Back to shop'
								actionHref='/shop'
							/>
						</div>
					</Container>
				</section>
			</>
		);
	}

	const deliveredSteps = steps.map((step, index) => ({
		...step,
		done: index <= 1,
	}));

	return (
		<>
			<Header text='Track order' />
			<section>
				<Container>
					<div className='mt-4 rounded-3xl border border-border/80 bg-card p-4 shadow-sm sm:p-5'>
						<div className='flex items-center justify-between gap-3'>
							<div>
								<p className='text-[10px] uppercase tracking-[0.14em] text-muted-foreground'>
									Order
								</p>
								<h2 className='mt-1 text-lg font-bold tracking-tight text-foreground'>
									{order.id}
								</h2>
							</div>
							<span className='rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700'>
								Processing
							</span>
						</div>

						<div className='mt-6 flex items-center'>
							{deliveredSteps.map((step, index) => (
								<Fragment key={step.label}>
									<div className='flex flex-col items-center'>
										<span
											className={cn(
												"flex size-8 items-center justify-center rounded-full text-xs font-bold",
												step.done
													? "bg-emerald-500 text-white"
													: "border border-border bg-muted text-muted-foreground",
											)}>
											{step.done ? (
												<CheckCircle2 className='size-4' />
											) : (
												index + 1
											)}
										</span>
										<span className='mt-1.5 text-[10px] font-medium text-muted-foreground'>
											{step.label}
										</span>
									</div>
									{index < deliveredSteps.length - 1 ? (
										<span
											className={cn(
												"mx-1 mb-5 h-0.5 flex-1 rounded",
												deliveredSteps[index + 1].done
													? "bg-emerald-500"
													: "bg-border",
											)}
										/>
									) : null}
								</Fragment>
							))}
						</div>

						<div className='mt-5 flex items-center gap-2 text-sm text-muted-foreground'>
							<Truck className='size-4 text-primary' />
							Estimated delivery: 3–5 business days
						</div>
					</div>

					<div className='mt-4 rounded-3xl border border-border/80 bg-card shadow-sm'>
						<div className='border-b border-border px-4 py-3'>
							<h2 className='text-lg font-bold tracking-tight text-foreground'>
								Items
							</h2>
						</div>
						<div className='space-y-3 px-4 py-4'>
							{order.items.map((item) => (
								<div
									key={item.productId}
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
						<div className='space-y-2 border-t border-border px-4 py-4 text-sm'>
							<div className='flex items-center justify-between text-muted-foreground'>
								<span>Subtotal</span>
								<span className='font-medium text-foreground'>
									{formatCurrency(order.subtotal)}
								</span>
							</div>
							<div className='flex items-center justify-between text-muted-foreground'>
								<span>Shipping</span>
								<span className='font-medium text-foreground'>
									{order.shipping === 0
										? "Free"
										: formatCurrency(order.shipping)}
								</span>
							</div>
							<div className='flex items-center justify-between text-muted-foreground'>
								<span>Estimated tax</span>
								<span className='font-medium text-foreground'>
									{formatCurrency(order.tax)}
								</span>
							</div>
							<div className='flex items-center justify-between border-t border-border pt-3'>
								<span className='font-semibold text-foreground'>Total</span>
								<span className='text-2xl font-bold text-primary'>
									{formatCurrency(order.total)}
								</span>
							</div>
						</div>
					</div>

					<div className='mt-4 rounded-3xl border border-border/80 bg-card p-4 shadow-sm sm:p-5'>
						<h2 className='text-lg font-bold tracking-tight text-foreground'>
							Shipping address
						</h2>
						<div className='mt-2 text-sm leading-relaxed text-muted-foreground'>
							<p className='font-medium text-foreground'>
								{order.shippingAddress.fullName}
							</p>
							<p>
								{order.shippingAddress.address}, {order.shippingAddress.city}
							</p>
							<p>{order.shippingAddress.phone}</p>
						</div>
					</div>
				</Container>
			</section>
		</>
	);
}