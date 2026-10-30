"use client";

import { useState } from "react";
import {
	CheckCircle2,
	MapPin,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { alert, Button, Container, Skeleton, useMounted } from "@/shared";
import { useAddressStore } from "../stores/useAddressStore";
import type { AddressInput } from "../schema";
import { AddressForm } from "./AddressForm";

export function AddressBook() {
	const addresses = useAddressStore((state) => state.addresses);
	const addAddress = useAddressStore((state) => state.addAddress);
	const updateAddress = useAddressStore((state) => state.updateAddress);
	const removeAddress = useAddressStore((state) => state.removeAddress);
	const setDefaultAddress = useAddressStore(
		(state) => state.setDefaultAddress,
	);
	const mounted = useMounted();
	const [adding, setAdding] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	if (!mounted) {
		return (
			<Container className='space-y-2 pb-6'>
				<Skeleton className='h-28 w-full rounded-3xl' />
				<Skeleton className='h-28 w-full rounded-3xl' />
			</Container>
		);
	}

	const handleAdd = (input: AddressInput) => {
		addAddress(input);
		setAdding(false);
		alert.success("Address saved.");
	};

	const handleUpdate = (id: string, input: AddressInput) => {
		updateAddress(id, input);
		setEditingId(null);
		alert.success("Address updated.");
	};

	const handleDelete = (id: string) => {
		if (!window.confirm("Delete this address?")) return;
		removeAddress(id);
		alert.info("Address removed.");
	};

	return (
		<Container className='space-y-3 pb-6'>
			<div className='flex items-center justify-between gap-2'>
				<div>
					<h2 className='text-sm font-semibold text-foreground'>
						Delivery addresses
					</h2>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{addresses.length === 0
							? "Add an address for faster checkout."
							: `${addresses.length} saved ${addresses.length === 1 ? "address" : "addresses"}.`}
					</p>
				</div>
				{!adding ? (
					<Button
						type='button'
						size='sm'
						variant='outline'
						className='rounded-full'
						onClick={() => {
							setAdding(true);
							setEditingId(null);
						}}>
						<Plus className='size-3.5' />
						Add
					</Button>
				) : null}
			</div>

			{adding ? (
				<AddressForm
					onSave={handleAdd}
					onCancel={() => setAdding(false)}
				/>
			) : null}

			{addresses.length === 0 && !adding ? (
				<div className='flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-10 text-center'>
					<span className='flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
						<MapPin className='size-6' />
					</span>
					<h3 className='mt-4 text-sm font-semibold text-foreground'>
						No addresses yet
					</h3>
					<p className='mt-1 max-w-xs text-xs text-muted-foreground'>
						Save a delivery address here and it will be ready when you check
						out.
					</p>
					<Button
						type='button'
						className='mt-4 rounded-full'
						onClick={() => setAdding(true)}>
						<Plus className='size-4' />
						Add your first address
					</Button>
				</div>
			) : null}

			<ul className='space-y-2'>
				{addresses.map((address) =>
					editingId === address.id ? (
						<li key={address.id}>
							<AddressForm
								initial={address}
								onSave={(input) => handleUpdate(address.id, input)}
								onCancel={() => setEditingId(null)}
							/>
						</li>
					) : (
						<li
							key={address.id}
							className='rounded-3xl border border-border bg-card p-4 shadow-sm'>
							<div className='flex items-start justify-between gap-2'>
								<div className='flex min-w-0 items-start gap-3'>
									<span className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
										<MapPin className='size-4' />
									</span>
									<div className='min-w-0'>
										<div className='flex flex-wrap items-center gap-1.5'>
											<h3 className='text-sm font-semibold text-foreground'>
												{address.label}
											</h3>
											{address.isDefault ? (
												<span className='inline-flex items-center gap-1 rounded-full bg-success-muted px-2 py-0.5 text-[10px] font-medium text-success-foreground'>
													<CheckCircle2 className='size-3' />
													Default
												</span>
											) : null}
										</div>
										<p className='mt-1 text-xs font-medium text-foreground'>
											{address.fullName}
										</p>
										<p className='mt-0.5 text-xs text-muted-foreground'>
											{address.address}
											{address.city ? `, ${address.city}` : ""}
											{address.postalCode ? ` ${address.postalCode}` : ""}
										</p>
										<p className='mt-1 text-xs text-muted-foreground'>
											{address.phone}
										</p>
									</div>
								</div>
							</div>

							<div className='mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3'>
								<Button
									type='button'
									variant='outline'
									size='sm'
									className='rounded-full'
									onClick={() => {
										setEditingId(address.id);
										setAdding(false);
									}}>
									<Pencil className='size-3.5' />
									Edit
								</Button>
								{!address.isDefault ? (
									<Button
										type='button'
										variant='outline'
										size='sm'
										className='rounded-full'
										onClick={() => {
											setDefaultAddress(address.id);
											alert.success("Default address updated.");
										}}>
										<CheckCircle2 className='size-3.5' />
										Set default
									</Button>
								) : null}
								<Button
									type='button'
									variant='ghost'
									size='sm'
									className='ml-auto rounded-full text-danger hover:bg-danger-muted'
									onClick={() => handleDelete(address.id)}>
									<Trash2 className='size-3.5' />
									Remove
								</Button>
							</div>
						</li>
					),
				)}
			</ul>
		</Container>
	);
}
