import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/shared";
import { Header } from "@/features/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";
import { getCheckoutSession } from "@/features/checkout/server/checkout.repository";
import { OrderConfirmation } from "@/features/checkout/components/OrderConfirmation";
import { shippingAddressSchema } from "@/features/checkout/schema";
import type { Order } from "@/features/orders/schema";
import { Clock } from "lucide-react";

export const instant = false;

/**
 * Stripe sends the browser here after payment with `?session_id=...`. The id is
 * looked up with the secret key, so this page shows what Stripe actually
 * charged rather than trusting anything the client sends.
 */
export default async function CheckoutSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ session_id?: string | string[] }>;
}) {
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=%2Fcheckout");
	if (user.role !== "user") redirect("/");

	const params = await searchParams;
	const sessionId = Array.isArray(params.session_id)
		? params.session_id[0]
		: params.session_id;

	if (!sessionId) redirect("/checkout");

	const session = await getCheckoutSession(sessionId).catch((error) => {
		console.error("Could not load the Stripe Checkout Session.", error);
		return null;
	});

	// A session id from the URL is not proof of anything, so it must belong to
	// the signed-in customer.
	if (!session || session.metadata?.userId !== user.id) {
		redirect("/checkout");
	}

	if (session.payment_status !== "paid") {
		return (
			<>
				<Header text='Payment' />
				<section className='my-4'>
					<Container>
						<div className='mt-10 flex flex-col items-center text-center'>
							<span className='flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600'>
								<Clock className='size-8' />
							</span>
							<h2 className='mt-5 text-2xl font-bold tracking-tight text-foreground'>
								Payment not completed
							</h2>
							<p className='mt-2 max-w-sm text-sm text-muted-foreground'>
								Stripe has not confirmed this payment yet. If you were charged,
								it can take a moment to show up.
							</p>
							<Link
								href='/checkout'
								className='mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-foreground-inverse transition-all hover:bg-primary/80'>
								Back to checkout
							</Link>
						</div>
					</Container>
				</section>
			</>
		);
	}

	const lineItems = session.line_items?.data ?? [];

	const metadataOf = (line: (typeof lineItems)[number]) => {
		const product = line.price?.product;
		return typeof product === "object" &&
			product !== null &&
			"metadata" in product
			? product.metadata
			: {};
	};

	const items = lineItems
		.filter((line) => metadataOf(line).kind !== "tax")
		.map((line) => ({
			productId: metadataOf(line).productId ?? line.id,
			name: line.description ?? "Item",
			price: (line.price?.unit_amount ?? 0) / 100,
			qty: line.quantity ?? 1,
		}));

	const tax =
		lineItems
			.filter((line) => metadataOf(line).kind === "tax")
			.reduce((sum, line) => sum + line.amount_total, 0) / 100;
	const shipping = (session.total_details?.amount_shipping ?? 0) / 100;
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);
	const total = (session.amount_total ?? 0) / 100;

	const address = shippingAddressSchema.safeParse({
		fullName: session.metadata?.ship_name,
		email: session.metadata?.ship_email,
		address: session.metadata?.ship_address,
		city: session.metadata?.ship_city,
		postalCode: session.metadata?.ship_postal,
		phone: session.metadata?.ship_phone,
	});

	if (items.length === 0 || !address.success) {
		redirect("/checkout");
	}

	const order: Order = {
		id: session.id,
		items,
		subtotal,
		shipping,
		tax,
		total,
		placedAt: new Date(session.created * 1000).toISOString(),
		shippingAddress: {
			fullName: address.data.fullName,
			address: address.data.address,
			city: address.data.city,
			phone: address.data.phone,
		},
	};

	return (
		<>
			<Header text='Order placed' />
			<section className='my-4'>
				<Container>
					<OrderConfirmation order={order} />
				</Container>
			</section>
		</>
	);
}
