"use client";

import {
	useEffect,
	useMemo,
	useState,
	type ChangeEvent,
	type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Container, Input, formatCurrency } from "@/shared";
import { Header } from "@/features/navigation";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useCheckoutStore } from "@/features/checkout/stores/useCheckoutStore";
import { useProductsByIds } from "@/features/products";
import { resolveCartItem } from "@/features/cart/lib/resolveCartItem";
import { useOrderStore } from "@/features/orders/stores/useOrderStore";
import type { Order } from "@/features/orders/schema";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

type PaymentForm = {
	cardName: string;
	cardNumber: string;
	expiry: string;
	cvc: string;
};

const initialPayment: PaymentForm = {
	cardName: "",
	cardNumber: "",
	expiry: "",
	cvc: "",
};

function generateOrderId() {
	return `TN-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
}

export default function PaymentPage() {
	const router = useRouter();
	const shipping = useCheckoutStore((state) => state.shipping);
	const clearCheckout = useCheckoutStore((state) => state.clearCheckout);
	const cart = useCartStore((state) => state.cart);
	const productIds = useMemo(() => cart.map((line) => line.productId), [cart]);
	const { productsById, isLoading } = useProductsByIds(productIds);
	const clearCart = useCartStore((state) => state.clearCart);
	const addOrder = useOrderStore((state) => state.addOrder);

	const [form, setForm] = useState<PaymentForm>(initialPayment);
	const [processing, setProcessing] = useState(false);
	const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

	useEffect(() => {
		if (!shipping && !completedOrder) {
			router.replace("/checkout");
		}
	}, [shipping, completedOrder, router]);

	const update =
		(key: keyof PaymentForm) => (event: ChangeEvent<HTMLInputElement>) =>
			setForm((prev) => ({ ...prev, [key]: event.target.value }));

	if (completedOrder) {
		return (
			<>
				<Header text='Order placed' />
				<section>
					<Container>
						<div className='mt-10 flex flex-col items-center text-center'>
							<span className='flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
								<CheckCircle2 className='size-8' />
							</span>
							<h2 className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
								Order placed successfully!
							</h2>
							<p className='mt-2 max-w-sm text-sm text-muted-foreground'>
								Order{" "}
								<span className='font-medium text-foreground'>
									{completedOrder.id}
								</span>{" "}
								· {formatCurrency(completedOrder.total)}
							</p>
							<Link
								href={`/track/${completedOrder.id}`}
								className='mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-foreground-inverse transition-all hover:bg-primary/80'>
								Track your order
							</Link>
							<Link
								href='/shop'
								className='mt-3 inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-8 text-sm font-medium text-foreground transition-colors hover:border-primary'>
								Continue shopping
							</Link>
						</div>
					</Container>
				</section>
			</>
		);
	}

	if (!shipping) {
		return (
			<>
				<Header text='Payment' />
				<section>
					<Container>
						<p className='mt-4 text-sm text-muted-foreground'>Redirecting…</p>
					</Container>
				</section>
			</>
		);
	}

	const orderItems = cart.map((line) => {
		const product = productsById.get(line.productId);
		if (!product) {
			return { productId: line.productId, name: "", price: 0, qty: line.qty };
		}

		// Price the exact variation that was added, not the product's lowest price.
		const item = resolveCartItem(line, product);
		return {
			productId: item.productId,
			name: item.name,
			price: item.price,
			qty: item.quantity,
		};
	});
	const hasUnavailableProducts =
		!isLoading && orderItems.some((item) => !item.name);

	const subtotal = orderItems.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const shippingFee = subtotal === 0 || subtotal > 300 ? 0 : 19;
	const tax = subtotal * 0.08;
	const total = subtotal + shippingFee + tax;

	const handlePay = (event: FormEvent) => {
		event.preventDefault();
		if (isLoading || hasUnavailableProducts || cart.length === 0) {
			return;
		}
		setProcessing(true);
		window.setTimeout(() => {
			const order: Order = {
				id: generateOrderId(),
				items: orderItems,
				subtotal,
				shipping: shippingFee,
				tax,
				total,
				placedAt: new Date().toISOString(),
				shippingAddress: {
					fullName: shipping.fullName,
					address: shipping.address,
					city: shipping.city,
					phone: shipping.phone,
				},
			};
			addOrder(order);
			clearCart();
			clearCheckout();
			setCompletedOrder(order);
			setProcessing(false);
		}, 1200);
	};

	return (
		<>
			<Header text='Payment' />
			<section>
				<Container>
					<section className='mt-4'>
						<h2 className='text-xl font-bold tracking-tight text-foreground'>
							Payment details
						</h2>
						<form
							className='mt-4 rounded-3xl border border-border/80 bg-card p-4 shadow-sm sm:p-5'
							onSubmit={handlePay}>
							<div className='grid gap-4 sm:grid-cols-2'>
								<label className='block sm:col-span-2'>
									<span className='mb-1.5 block text-sm font-medium text-foreground'>
										Name on card
									</span>
									<Input
										value={form.cardName}
										onChange={update("cardName")}
										placeholder='Jane Doe'
										className='h-11 rounded-xl border-border bg-background shadow-sm'
										required
									/>
								</label>
								<label className='block sm:col-span-2'>
									<span className='mb-1.5 block text-sm font-medium text-foreground'>
										Card number
									</span>
									<Input
										inputMode='numeric'
										value={form.cardNumber}
										onChange={update("cardNumber")}
										placeholder='4242 4242 4242 4242'
										className='h-11 rounded-xl border-border bg-background shadow-sm'
										required
									/>
								</label>
								<label className='block'>
									<span className='mb-1.5 block text-sm font-medium text-foreground'>
										Expiry
									</span>
									<Input
										value={form.expiry}
										onChange={update("expiry")}
										placeholder='MM/YY'
										className='h-11 rounded-xl border-border bg-background shadow-sm'
										required
									/>
								</label>
								<label className='block'>
									<span className='mb-1.5 block text-sm font-medium text-foreground'>
										CVC
									</span>
									<Input
										inputMode='numeric'
										value={form.cvc}
										onChange={update("cvc")}
										placeholder='123'
										className='h-11 rounded-xl border-border bg-background shadow-sm'
										required
									/>
								</label>
							</div>

							<div className='mt-4 flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground'>
								<Lock className='size-4 shrink-0 text-emerald-600' />
								Demo checkout — no real payment is charged.
							</div>

							<Button
								type='submit'
								disabled={
									processing ||
									isLoading ||
									hasUnavailableProducts ||
									cart.length === 0
								}
								className='mt-5 h-12 w-full gap-2 rounded-full text-base'>
								{processing ? (
									<Loader2 className='size-4 animate-spin' />
								) : null}
								{processing
									? "Processing payment…"
									: `Pay ${formatCurrency(total)}`}
							</Button>
						</form>
					</section>

					<section className='mt-6 rounded-3xl border border-border/80 bg-card p-4 shadow-sm sm:p-5'>
						<h2 className='text-lg font-bold tracking-tight text-foreground'>
							Delivering to
						</h2>
						<p className='mt-2 text-sm text-muted-foreground'>
							{shipping.fullName} · {shipping.address}, {shipping.city} ·{" "}
							{shipping.phone}
						</p>
					</section>
				</Container>
			</section>
		</>
	);
}
