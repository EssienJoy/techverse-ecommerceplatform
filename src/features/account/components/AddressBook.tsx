"use client";

import { useState } from "react";
import {
	MapPin,
	Plus,
	Star,
	Trash2,
	X,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared";
import { useAddressStore } from "../stores/useAddressStore";
import type { AddressEntry } from "../schema";

type AddressDraft = Omit<AddressEntry, "id" | "isDefault">;

const emptyDraft: AddressDraft = {
	label: "Home",
	fullName: "",
	phone: "",
	address: "",
	city: "",
	postalCode: "",
};

const fields: {
	name: keyof AddressDraft;
	label: string;
	placeholder: string;
	autoComplete: string;
}[] = [
	{
		name: "label",
		label: "Label",
		placeholder: "Home or Office",
		autoComplete: "off",
	},
	{
		name: "fullName",
		label: "Full name",
		placeholder: "Ada Obi",
		autoComplete: "name",
	},
	{
		name: "phone",
		label: "Phone",
		placeholder: "+234 800 000 0000",
		autoComplete: "tel",
	},
	{
		name: "address",
		label: "Street address",
		placeholder: "12 Admiralty Way",
		autoComplete: "street-address",
	},
	{
		name: "city",
		label: "City",
		placeholder: "Lekki, Lagos",
		autoComplete: "address-level2",
	},
	{
		name: "postalCode",
		label: "Postal code",
		placeholder: "106104",
		autoComplete: "postal-code",
	},
];

const inputClass =
	"h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40";

export function AddressBook() {
	const addresses = useAddressStore((state) => state.addresses);
	const addAddress = useAddressStore((state) => state.addAddress);
	const removeAddress = useAddressStore((state) => state.removeAddress);
	const setDefaultAddress = useAddressStore(
		(state) => state.setDefaultAddress,
	);

	const [isAdding, setIsAdding] = useState(false);
	const [draft, setDraft] = useState<AddressDraft>(emptyDraft);
	const [error, setError] = useState<string | null>(null);

	const closeForm = () => {
		setIsAdding(false);
		setDraft(emptyDraft);
		setError(null);
	};

	const submit = () => {
		const missing = fields.find(
			(field) => !draft[field.name].trim(),
		);

		if (missing) {
			setError(`Enter your ${missing.label.toLowerCase()}.`);
			return;
		}

		addAddress(
			Object.fromEntries(
				fields.map((field) => [field.name, draft[field.name].trim()]),
			) as AddressDraft,
		);
		closeForm();
	};

	return (
		<div className='space-y-3'>
			{addresses.length === 0 && !isAdding ? (
				<div className='flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-10 text-center'>
					<span className='flex size-14 items-center justify-center rounded-full bg-primary-subtle text-primary'>
						<MapPin className='size-6' aria-hidden />
					</span>
					<p className='mt-4 text-sm font-semibold text-foreground'>
						No saved addresses
					</p>
					<p className='mt-1 max-w-[16rem] text-xs leading-relaxed text-muted-foreground'>
						Add a delivery address so checkout is quicker next time.
					</p>
				</div>
			) : null}

			<ul className='space-y-2'>
				{addresses.map((address) => (
					<li
						key={address.id}
						className={cn(
							"rounded-3xl border bg-card p-4 shadow-sm",
							address.isDefault
								? "border-primary/40"
								: "border-border/80",
						)}>
						<div className='flex items-start justify-between gap-3'>
							<div className='min-w-0'>
								<div className='flex flex-wrap items-center gap-2'>
									<p className='text-sm font-semibold text-foreground'>
										{address.fullName}
									</p>
									{address.isDefault ? (
										<span className='rounded-full bg-primary-subtle px-2 py-1 text-[10px] font-semibold tracking-wide text-foreground-primary uppercase'>
											Default
										</span>
									) : null}
								</div>
								<p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
									{address.address}, {address.city} {address.postalCode}
								</p>
								<p className='text-xs text-muted-foreground'>{address.phone}</p>
							</div>

							<button
								type='button'
								aria-label={`Delete address for ${address.fullName}`}
								onClick={() => removeAddress(address.id)}
								className='flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-danger-muted hover:text-danger'>
								<Trash2 className='size-4' />
							</button>
						</div>

						{!address.isDefault ? (
							<button
								type='button'
								onClick={() => setDefaultAddress(address.id)}
								className='mt-3 inline-flex items-center gap-2 text-xs font-medium text-primary'>
								<Star className='size-3.5' />
								Make default
							</button>
						) : null}
					</li>
				))}
			</ul>

			{isAdding ? (
				<section className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
					<div className='flex items-center justify-between'>
						<h2 className='text-sm font-semibold text-foreground'>
							New address
						</h2>
						<button
							type='button'
							aria-label='Cancel'
							onClick={closeForm}
							className='flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted'>
							<X className='size-4' />
						</button>
					</div>

					<form
						className='mt-3 space-y-3'
						onSubmit={(event) => {
							event.preventDefault();
							submit();
						}}>
						{fields.map((field) => (
							<div key={field.name} className='space-y-1'>
								<label
									htmlFor={`address-${field.name}`}
									className='text-xs font-medium text-foreground'>
									{field.label}
								</label>
								<input
									id={`address-${field.name}`}
									name={field.name}
									value={draft[field.name]}
									placeholder={field.placeholder}
									autoComplete={field.autoComplete}
									onChange={(event) =>
										setDraft((current) => ({
											...current,
											[field.name]: event.target.value,
										}))
									}
									className={inputClass}
								/>
							</div>
						))}

						{error ? (
							<p
								role='alert'
								className='rounded-xl border border-error-border bg-error-muted px-3 py-2 text-xs text-error-foreground'>
								{error}
							</p>
						) : null}

						<Button type='submit' className='h-11 w-full rounded-full'>
							Save address
						</Button>
					</form>
				</section>
			) : (
				<Button
					type='button'
					variant='outline'
					className='h-11 w-full rounded-full'
					onClick={() => setIsAdding(true)}>
					<Plus className='size-4' />
					Add a new address
				</Button>
			)}
		</div>
	);
}
