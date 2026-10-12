"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Input, formatCurrency } from "@/shared";
import { Header } from "../_components";
import { products } from "../product";
import { useCartStore } from "@/shared/store/useCartStore";
import { useCheckoutStore } from "@/shared/store/useCheckoutStore";
import { ChevronRight } from "lucide-react";

type ShippingForm = {
	fullName: string;
	email: string;
	address: string;
	city: string;
	phone: string;
	postalCode: string;
};

const initialForm: ShippingForm = {
	fullName: "",
	email: "",
	address: "",
	city: "",
	phone: "",
	postalCode: "",
};

export default function CheckoutPage() {
	const router = useRouter();
	const [form, setForm] = useState<ShippingForm>(initialForm);
	const cart = useCartStore((state) => state.cart);
	const setShipping = useCheckoutStore((state) => state.setShipping);

	const update =
		(key: keyof ShippingForm) =>
		(event: React.ChangeEvent<HTMLInputElement>) =>
			setForm((prev) => ({ ...prev, [key]: event.target.value }));

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		setShipping({
			fullName: form.fullName,
			email: form.email,
			address: form.address,
			city: form.city,
			phone: form.phone,
			postalCode: form.postalCode,
		});
		router.push("/checkout/payment");
	};

	const orderItems = cart.map((item) => {
		const product = products.find((p) => p.id === item.productId);
		return {
			productId: item.productId,
			name: product?.name ?? "Product",
			price: product?.price ?? 0,
			qty: item.qty,
		};
	});

	const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
	const shipping = subtotal === 0 || subtotal > 300 ? 0 : 19;
	const tax = subtotal * 0.08;
	const total = subtotal + shipping + tax;

	return (
		<>
			<Header text='Checkout' />
			<section>
				<Container>
					<section className='mt-4'>
						<h2 className='text-xl font-bold tracking-tight text-foreground'>
							Shipping Address
						</h2>
						<form className='mt-4' onSubmit={handleSubmit}>
							<div className='grid gap-4'>
								<label className='block'>
									<span className='mb-1.5 block text-xs font-medium text-foreground'>
										Full name
									</span>
									<Input
										value={form.fullName}
										onChange={update("fullName")}
										placeholder='John Doe'
										className='h-9 rounded-xl border-border bg-white shadow-sm'
										required
									/>
								</label>
								<label className='block'>
									<span className='mb-1.5 block text-xs font-medium text-foreground'>
										Email
									</span>
									<Input
										type='email'
										value={form.email}
										onChange={update("email")}
										placeholder='you@example.com'
										className='h-9 rounded-xl border-border bg-white shadow-sm'
										required
									/>
								</label>
								<label className='block'>
									<span className='mb-1.5 block text-xs font-medium text-foreground'>
										Address
									</span>
									<Input
										value={form.address}
										onChange={update("address")}
										placeholder='12 Main Street'
										className='h-9 rounded-xl border-border bg-white shadow-sm'
										required
									/>
								</label>
								<label className='block'>
									<span className='mb-1.5 block text-xs font-medium text-foreground'>
										City
									</span>
									<Input
										value={form.city}
										onChange={update("city")}
										placeholder='Lagos'
										className='h-9 rounded-xl border-border bg-white shadow-sm'
										required
									/>
								</label>
								<div className='grid grid-cols-2 items-end gap-2'>
									<label className='block'>
										<span className='mb-1.5 block text-xs font-medium text-foreground'>
											Postal code
										</span>
										<Input
											value={form.postalCode}
											onChange={update("postalCode")}
											placeholder='100001'
											className='h-9 w-full rounded-xl border-border bg-white shadow-sm'
											required
										/>
									</label>
									<label className='block'>
										<span className='mb-1.5 block text-xs font-medium text-foreground'>
											Phone number
										</span>
										<Input
											type='tel'
											value={form.phone}
											onChange={update("phone")}
											placeholder='+234 800 000 0000'
											className='h-9 w-full rounded-xl border-border bg-white shadow-sm'
											required
										/>
									</label>
								</div>
							</div>

							<Button
								type='submit'
								className='mt-6 h-12 w-full gap-2 rounded-full text-base'>
								Continue to payment
								<ChevronRight className='size-4' />
							</Button>
						</form>
					</section>

					<section className='mt-6 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm'>
						<div className='border-b border-border px-4 py-3'>
							<h2 className='text-lg font-bold tracking-tight text-foreground'>
								Order summary
							</h2>
						</div>
						<div className='px-4 py-4'>
							{orderItems.length === 0 ? (
								<p className='text-sm text-muted-foreground'>
									No items in your cart yet.
								</p>
							) : (
								<div className='space-y-3'>
									{orderItems.map((item) => (
										<div
											key={item.productId}
											className='flex items-center justify-between gap-3 text-sm'>
											<span className='line-clamp-1'>
												{item.name}{" "}
												<span className='text-muted-foreground'>
													× {item.qty}
												</span>
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
				</Container>
			</section>
		</>
	);
}