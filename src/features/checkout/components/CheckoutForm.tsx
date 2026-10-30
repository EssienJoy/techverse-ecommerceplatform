"use client";

import { useEffect, useActionState, type ReactNode } from "react";
import Link from "next/link";
import { Button, formatCurrency, Input, InputGroup, Label } from "@/shared";
import {
	AlertCircle,
	ChevronRight,
	ExternalLink,
	Loader2,
	Lock,
	MapPin,
	UserRound,
} from "lucide-react";
import { startCheckoutSession } from "../server/checkout.service";
import { useCheckoutOrder } from "../lib/useCheckoutOrder";
import type { CheckoutActionState } from "../types";

const initialState: CheckoutActionState = { status: "idle", message: "" };

type CheckoutField = {
	id: string;
	name: string;
	label: string;
	placeholder: string;
	type: "text" | "email" | "tel";
	autoComplete: string;
	inputMode?: "text" | "email" | "tel" | "numeric";
	fullWidth?: boolean;
};

const contactFields: CheckoutField[] = [
	{
		id: "fullname",
		name: "fullname",
		label: "Full name",
		placeholder: "John Doe",
		type: "text",
		autoComplete: "name",
		fullWidth: true,
	},
	{
		id: "email",
		name: "email",
		label: "Email",
		placeholder: "your@example.com",
		type: "email",
		autoComplete: "email",
		inputMode: "email",
		fullWidth: true,
	},
	{
		id: "phone",
		name: "phone",
		label: "Phone number",
		placeholder: "+234 800 001 0000",
		type: "tel",
		autoComplete: "tel",
		inputMode: "tel",
		fullWidth: true,
	},
];

const addressFields: CheckoutField[] = [
	{
		id: "address",
		name: "address",
		label: "Street address",
		placeholder: "12 Main Street",
		type: "text",
		autoComplete: "street-address",
		fullWidth: true,
	},
	{
		id: "city",
		name: "city",
		label: "City",
		placeholder: "Lagos",
		type: "text",
		autoComplete: "address-level2",
	},
	{
		id: "postalcode",
		name: "postalcode",
		label: "Postal code",
		placeholder: "100001",
		type: "text",
		autoComplete: "postal-code",
		inputMode: "numeric",
	},
];

function Field({
	field,
	defaultValue,
}: {
	field: CheckoutField;
	defaultValue?: string;
}) {
	return (
		<InputGroup className={field.fullWidth ? "col-span-2" : undefined}>
			<Label
				htmlFor={field.id}
				className='text-xs font-medium text-muted-foreground'>
				{field.label}
			</Label>
			<Input
				id={field.id}
				name={field.name}
				type={field.type}
				inputMode={field.inputMode}
				autoComplete={field.autoComplete}
				placeholder={field.placeholder}
				defaultValue={defaultValue}
				className='h-11 rounded-xl border-border bg-background px-3 text-sm shadow-sm'
				required
			/>
		</InputGroup>
	);
}

function Section({
	id,
	icon: Icon,
	title,
	hint,
	children,
}: {
	id: string;
	icon: typeof MapPin;
	title: string;
	hint: string;
	children: ReactNode;
}) {
	return (
		<section
			aria-labelledby={id}
			className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
			<div className='flex items-center gap-2.5'>
				<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
					<Icon className='size-4' aria-hidden />
				</span>
				<div>
					<h2 id={id} className='text-sm font-semibold text-foreground'>
						{title}
					</h2>
					<p className='text-xs text-muted-foreground'>{hint}</p>
				</div>
			</div>
			<div className='mt-4 grid grid-cols-2 gap-3'>{children}</div>
		</section>
	);
}

export function CheckoutForm({
	defaultName,
	defaultEmail,
}: {
	defaultName?: string;
	defaultEmail?: string;
}) {
	const [state, formAction, isPending] = useActionState(
		startCheckoutSession,
		initialState,
	);
	const checkoutUrl = state.status === "redirect" ? state.url : null;
	const { items, isLoading, hasUnavailableProducts, total, canContinue } =
		useCheckoutOrder();
	const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

	useEffect(() => {
		if (!checkoutUrl) return;

		// Stripe's hosted Checkout refuses to render inside an iframe, so the
		// payment page belongs to the top-level window. A normal phone browser
		// is already top-level; only an embedded preview differs.
		if (window.top === window.self) {
			window.location.assign(checkoutUrl);
		}
	}, [checkoutUrl]);

	if (checkoutUrl) {
		return (
			<div className='mt-4 rounded-3xl border border-border/80 bg-card p-5 text-center shadow-sm'>
				<span className='mx-auto flex size-12 items-center justify-center rounded-full bg-success-muted text-success-foreground'>
					<Lock className='size-5' aria-hidden />
				</span>
				<h2 className='mt-3 text-lg font-bold tracking-tight text-foreground'>
					Ready for secure payment
				</h2>
				<p className='mx-auto mt-1 max-w-xs text-sm text-muted-foreground'>
					Stripe&apos;s payment page has to run in a full browser tab, so tap
					below if you are viewing the store inside a preview pane.
				</p>
				<a
					href={checkoutUrl}
					target='_blank'
					rel='noopener noreferrer'
					className='mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-foreground-inverse transition-opacity hover:opacity-90'>
					Open secure payment page
					<ExternalLink className='size-4' aria-hidden />
				</a>
			</div>
		);
	}

	const disabledReason = isLoading
		? "Checking your cart…"
		: items.length === 0
			? "Your cart is empty."
			: hasUnavailableProducts
				? "Some items are no longer available."
				: null;

	return (
		<form action={formAction} className='mt-4 space-y-3'>
			<Section
				id='contact-heading'
				icon={UserRound}
				title='Contact information'
				hint='For your receipt and delivery updates.'>
				{contactFields.map((field) => (
					<Field
						key={field.id}
						field={field}
						defaultValue={
							field.id === "fullname"
								? defaultName
								: field.id === "email"
									? defaultEmail
									: undefined
						}
					/>
				))}
			</Section>

			<Section
				id='address-heading'
				icon={MapPin}
				title='Delivery address'
				hint='Where should we send your order?'>
				{addressFields.map((field) => (
					<Field key={field.id} field={field} />
				))}
			</Section>

			{state.status === "error" && (
				<div
					role='alert'
					className='flex items-start gap-2 rounded-2xl border border-danger-border bg-danger-muted px-3 py-2.5 text-sm text-danger-foreground'>
					<AlertCircle className='mt-0.5 size-4 shrink-0' aria-hidden />
					<p>{state.message}</p>
				</div>
			)}

			<div className='sticky bottom-0 z-10 -mx-2 mt-6 border-t border-border/70 bg-background/95 px-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur'>
				<div className='flex items-baseline justify-between gap-3'>
					<span className='text-sm text-muted-foreground'>
						Total
						{!isLoading && items.length > 0 && (
							<span className='text-muted-foreground'>
								{" "}
								· {itemCount} {itemCount === 1 ? "item" : "items"}
							</span>
						)}
					</span>
					<span className='text-xl font-bold tracking-tight text-foreground'>
						{formatCurrency(total)}
					</span>
				</div>

				<Button
					type='submit'
					disabled={isPending || !canContinue}
					aria-busy={isPending}
					className='mt-2.5 h-12 w-full gap-2 rounded-full text-base'>
					{isPending ? (
						<>
							<Loader2 className='size-4 animate-spin' aria-hidden />
							Taking you to payment…
						</>
					) : (
						<>
							Continue to payment
							<ChevronRight className='size-4' aria-hidden />
						</>
					)}
				</Button>

				<p className='mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground'>
					<Lock className='size-3' aria-hidden />
					Payments are handled by Stripe. Card details never touch this store.
				</p>

				{disabledReason && !isPending && (
					<p className='mt-1.5 text-center text-xs text-muted-foreground'>
						{disabledReason}{" "}
						<Link
							href={items.length === 0 ? "/shop" : "/cart"}
							className='font-medium text-primary underline-offset-2 hover:underline'>
							{items.length === 0 ? "Browse products" : "Review your cart"}
						</Link>
					</p>
				)}
			</div>
		</form>
	);
}
