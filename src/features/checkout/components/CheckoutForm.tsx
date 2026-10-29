"use client";

import { useEffect, useActionState } from "react";
import { Button, Input, InputGroup, Label } from "@/shared";
import { ChevronRight, ExternalLink } from "lucide-react";
import { startCheckoutSession } from "../server/checkout.service";
import type { CheckoutActionState } from "../schema";

const initialState: CheckoutActionState = { status: "idle", message: "" };

const checkoutFormInput = [
	{
		label: "Full Name",
		id: "fullname",
		name: "fullname",
		placeholder: "John Doe",
		type: "text",
	},
	{
		label: "Email",
		id: "email",
		name: "email",
		placeholder: "your@example.com",
		type: "email",
	},
	{
		label: "Address",
		id: "address",
		name: "address",
		placeholder: "12 Main Street",
		type: "text",
	},
	{
		label: "City",
		id: "city",
		name: "city",
		placeholder: "Lagos",
		type: "text",
	},
	{
		label: "Postal Code",
		id: "postalcode",
		name: "postalcode",
		placeholder: "100001",
		type: "text",
	},
	{
		label: "Phone Number",
		id: "phone",
		name: "phone",
		placeholder: "+234 800 001 0000",
		type: "tel",
	},
];

export function CheckoutForm() {
	const [state, formAction, isPending] = useActionState(
		startCheckoutSession,
		initialState,
	);
	const checkoutUrl = state.status === "redirect" ? state.url : null;

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
			<div className='mt-4 rounded-2xl border border-border bg-card p-5'>
				<p className='text-sm text-muted-foreground'>
					Your checkout is ready. Stripe&apos;s payment page has to run in a
					full browser tab, so use the button below if you are viewing the
					store inside a preview pane.
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

	return (
		<form className='mt-4' action={formAction}>
			<div className='grid grid-cols-2 gap-2'>
				{checkoutFormInput.map((i) => (
					<InputGroup key={i.id}>
						<Label htmlFor={i.id}>{i.label}:</Label>
						<Input
							id={i.id}
							name={i.name}
							type={i.type}
							placeholder={i.placeholder}
							className='h-9 rounded-xl border-border bg-white shadow-sm'
							required
						/>
					</InputGroup>
				))}
			</div>

			<Button
				type='submit'
				disabled={isPending}
				className='mt-6 h-12 w-full gap-2 rounded-full text-base'>
				{isPending ? "Redirecting..." : "Continue to payment"}
				<ChevronRight className='size-4' />
			</Button>

			{state.status === "error" && (
				<p className='mt-3 text-sm text-red-600'>{state.message}</p>
			)}
		</form>
	);
}
