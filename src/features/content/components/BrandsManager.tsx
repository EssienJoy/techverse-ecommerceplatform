"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Input } from "@/shared";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import type { ContentBrand } from "@/features/content/lib/brand";
import { ImageUpload } from "@/features/admin";
import {
	brandFormAction,
	deleteBrandAction,
	type ContentFormState,
} from "@/features/content/server/content.actions";

type Draft = { name: string; logoUrl: string };

const emptyDraft: Draft = { name: "", logoUrl: "" };
const initialState: ContentFormState = {};

export function BrandsManager({ brands }: { brands: ContentBrand[] }) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<Draft>(emptyDraft);
	const [state, setState] = useState<ContentFormState>(initialState);
	const [formKey, setFormKey] = useState(0);
	const [isPending, startTransition] = useTransition();

	const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
		setDraft((prev) => ({ ...prev, [key]: value }));

	const resetForm = () => {
		setDraft(emptyDraft);
		setEditingId(null);
		setState(initialState);
		setFormKey((key) => key + 1);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		if (editingId) formData.set("id", editingId);

		startTransition(async () => {
			const result = await brandFormAction(initialState, formData);
			if (result.success) {
				resetForm();
			} else {
				setState(result);
			}
		});
	};

	const handleEdit = (brand: ContentBrand) => {
		setEditingId(brand.id);
		setDraft({ name: brand.name, logoUrl: brand.logoUrl ?? "" });
		setState(initialState);
		setFormKey((key) => key + 1);
	};

	const handleDelete = (id: string) => {
		startTransition(async () => {
			await deleteBrandAction(id);
		});
	};

	const fieldErrors = state.fieldErrors ?? {};

	return (
		<>
			<Card>
				<CardContent>
					<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
						<div className='grid gap-4 lg:grid-cols-[200px_1fr]'>
							<div className='flex flex-col gap-2'>
								<Label>Brand logo</Label>
								<input type='hidden' name='logoUrl' value={draft.logoUrl} />
								<ImageUpload
									key={formKey}
									label='Upload logo'
									hint='Square image, PNG or SVG'
									value={draft.logoUrl || null}
									onChange={(value) => update("logoUrl", value ?? "")}
								/>
							</div>
							<div className='flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='brand-name'>Brand name</Label>
									<Input
										id='brand-name'
										name='name'
										value={draft.name}
										onChange={(event) => update("name", event.target.value)}
										placeholder='e.g. Samsung'
										aria-invalid={Boolean(fieldErrors.name)}
									/>
									{fieldErrors.name?.[0] ? (
										<p className='text-xs text-danger'>{fieldErrors.name[0]}</p>
									) : null}
								</div>
								<div className='flex justify-end gap-2'>
									{editingId ? (
										<Button type='button' variant='outline' onClick={resetForm}>
											Cancel
										</Button>
									) : null}
									<Button type='submit' disabled={isPending}>
										<Plus />
										{isPending
											? "Saving…"
											: editingId
												? "Save changes"
												: "Add brand"}
									</Button>
								</div>
								{state.formError ? (
									<p className='rounded-lg border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger'>
										{state.formError}
									</p>
								) : null}
							</div>
						</div>
					</form>
				</CardContent>
			</Card>

			<div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
				{brands.map((brand) => (
					<Card key={brand.id}>
						<CardContent className='flex flex-col gap-2'>
							<div className='flex h-16 items-center justify-center overflow-hidden rounded-xl bg-surface-muted'>
								{brand.logoUrl ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={brand.logoUrl}
										alt={brand.name}
										className='h-full w-full object-contain'
									/>
								) : (
									<span
										className='text-lg font-bold
									capitalize text-muted-foreground'>
										{brand.name.charAt(0)}
									</span>
								)}
							</div>
							<div className='flex items-center justify-between gap-1'>
								<span className='truncate text-sm font-medium'>
									{brand.name}
								</span>
								<div className='flex shrink-0 gap-1'>
									<Button
										variant='ghost'
										size='icon-sm'
										aria-label='Edit brand'
										onClick={() => handleEdit(brand)}>
										<Pencil />
									</Button>
									<Button
										variant='ghost'
										size='icon-sm'
										aria-label='Delete brand'
										disabled={isPending}
										onClick={() => handleDelete(brand.id)}>
										<Trash2 />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
