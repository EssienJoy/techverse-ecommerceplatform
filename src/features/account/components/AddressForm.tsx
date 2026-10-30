"use client";

import { useState } from "react";
import { Button, Input, Label } from "@/shared";
import { Textarea } from "@/shared/components/ui/textarea";
import {
	addressInputSchema,
	type Address,
	type AddressInput,
} from "../schema";

type AddressFormProps = {
	initial?: Address;
	onSave: (input: AddressInput) => void;
	onCancel: () => void;
};

type FieldErrors = Record<string, string[] | undefined>;

export function AddressForm({ initial, onSave, onCancel }: AddressFormProps) {
	const [errors, setErrors] = useState<FieldErrors>({});
	const formId = initial?.id ?? "new";

	return (
		<form
			key={formId}
			className='rounded-3xl border border-border bg-card p-4 shadow-sm'
			onSubmit={(event) => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				const parsed = addressInputSchema.safeParse({
					label: String(data.get("label") ?? ""),
					fullName: String(data.get("fullName") ?? ""),
					phone: String(data.get("phone") ?? ""),
					address: String(data.get("address") ?? ""),
					city: String(data.get("city") ?? ""),
					postalCode: String(data.get("postalCode") ?? "").trim() || undefined,
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
						{initial ? "Edit address" : "New address"}
					</h2>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						Saved on this device for faster checkout.
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
				<div className='grid gap-3 sm:grid-cols-2'>
					<Field
						label='Label'
						name='label'
						defaultValue={initial?.label}
						placeholder='Home, Work…'
						errors={errors.label}
					/>
					<Field
						label='Full name'
						name='fullName'
						defaultValue={initial?.fullName}
						placeholder='Recipient name'
						autoComplete='name'
						errors={errors.fullName}
					/>
				</div>

				<div className='grid gap-3 sm:grid-cols-2'>
					<Field
						label='Phone'
						name='phone'
						type='tel'
						inputMode='tel'
						defaultValue={initial?.phone}
						placeholder='+234 800 000 0000'
						autoComplete='tel'
						errors={errors.phone}
					/>
					<Field
						label='City'
						name='city'
						defaultValue={initial?.city}
						placeholder='Lagos'
						autoComplete='address-level2'
						errors={errors.city}
					/>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='address-street' className='text-xs'>
						Street address
					</Label>
					<Textarea
						id='address-street'
						name='address'
						defaultValue={initial?.address}
						placeholder='House number, street, area'
						autoComplete='street-address'
						aria-invalid={Boolean(errors.address)}
						className='min-h-20 rounded-xl bg-white dark:bg-input/30'
					/>
					<FieldError message={errors.address?.[0]} />
				</div>

				<Field
					label='Postal code (optional)'
					name='postalCode'
					inputMode='numeric'
					defaultValue={initial?.postalCode}
					placeholder='100001'
					autoComplete='postal-code'
					errors={errors.postalCode}
				/>
			</div>

			<Button type='submit' className='mt-4 h-10 w-full rounded-full'>
				{initial ? "Save changes" : "Save address"}
			</Button>
		</form>
	);
}

type FieldProps = {
	label: string;
	name: string;
	defaultValue?: string;
	placeholder?: string;
	type?: string;
	inputMode?: "text" | "tel" | "numeric";
	autoComplete?: string;
	errors?: string[];
};

function Field({
	label,
	name,
	defaultValue,
	placeholder,
	type = "text",
	inputMode,
	autoComplete,
	errors,
}: FieldProps) {
	const id = `address-${name}`;

	return (
		<div className='grid gap-2'>
			<Label htmlFor={id} className='text-xs'>
				{label}
			</Label>
			<Input
				id={id}
				name={name}
				type={type}
				inputMode={inputMode}
				defaultValue={defaultValue}
				placeholder={placeholder}
				autoComplete={autoComplete}
				aria-invalid={Boolean(errors)}
				className='h-9 rounded-xl bg-white dark:bg-input/30'
			/>
			<FieldError message={errors?.[0]} />
		</div>
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
