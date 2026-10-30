"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/shared";
import {
	cardBrandLabels,
	savedCardInputSchema,
	type CardBrand,
	type SavedCard,
	type SavedCardInput,
} from "../schema";

type CardFormProps = {
	onSave: (input: SavedCardInput) => void;
	onCancel: () => void;
};

type FieldErrors = Record<string, string[] | undefined>;

const brands = Object.entries(cardBrandLabels) as [CardBrand, string][];

export function CardForm({ onSave, onCancel }: CardFormProps) {
	const [errors, setErrors] = useState<FieldErrors>({});

	return (
		<form
			className='rounded-3xl border border-border bg-card p-4 shadow-sm'
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				const parsed = savedCardInputSchema.safeParse({
					cardholder: String(data.get("cardholder") ?? ""),
					brand: String(data.get("brand") ?? "visa"),
					last4: String(data.get("last4") ?? ""),
					expiry: String(data.get("expiry") ?? ""),
				});

				if (!parsed.success) {
					setErrors(parsed.error.flatten().fieldErrors);
					return;
				}

				setErrors({});
				onSave(parsed.data);
			}}>
			<div className='flex items-start justify-between gap-2'>
				<div>
					<h2 className='font-heading text-base font-semibold text-foreground'>
						Add a card
					</h2>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						Only these details are kept on this device.
					</p>
				</div>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={onCancel}>
					Cancel
				</Button>
			</div>

			<div className='mt-4 grid gap-3'>
				<div className='grid gap-2'>
					<Label htmlFor='card-cardholder' className='text-xs'>
						Name on card
					</Label>
					<Input
						id='card-cardholder'
						name='cardholder'
						placeholder='As shown on the card'
						autoComplete='cc-name'
						aria-invalid={Boolean(errors.cardholder)}
						className='h-9 rounded-xl bg-white dark:bg-input/30'
					/>
					<FieldError message={errors.cardholder?.[0]} />
				</div>

				<div className='grid gap-3 sm:grid-cols-2'>
					<div className='grid gap-2'>
						<Label htmlFor='card-brand' className='text-xs'>
							Card brand
						</Label>
						<select
							id='card-brand'
							name='brand'
							defaultValue='visa'
							className='h-9 w-full rounded-xl border border-input bg-white px-2.5 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'>
							{brands.map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='card-last4' className='text-xs'>
							Last 4 digits
						</Label>
						<Input
							id='card-last4'
							name='last4'
							inputMode='numeric'
							maxLength={4}
							placeholder='4242'
							autoComplete='cc-number'
							aria-invalid={Boolean(errors.last4)}
							className='h-9 rounded-xl bg-white dark:bg-input/30'
						/>
						<FieldError message={errors.last4?.[0]} />
					</div>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='card-expiry' className='text-xs'>
						Expiry
					</Label>
					<Input
						id='card-expiry'
						name='expiry'
						inputMode='numeric'
						maxLength={5}
						placeholder='MM/YY'
						autoComplete='cc-exp'
						aria-invalid={Boolean(errors.expiry)}
						className='h-9 rounded-xl bg-white dark:bg-input/30'
					/>
					<FieldError message={errors.expiry?.[0]} />
				</div>
			</div>

			<p className='mt-3 rounded-xl bg-muted/40 p-2.5 text-[11px] leading-4 text-muted-foreground'>
				For your safety, this store never asks for or stores a full card
				number or CVV. Checkout is completed on Stripe.
			</p>

			<Button type='submit' className='mt-4 h-10 w-full rounded-full'>
				Save card
			</Button>
		</form>
	);
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null;

	return (
		<p className='text-xs text-danger' role='alert'>
			{message}
		</p>
	);
}
