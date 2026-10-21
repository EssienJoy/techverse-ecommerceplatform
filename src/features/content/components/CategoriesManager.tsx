"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Input } from "@/shared";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
	categoryIcons,
	type CategoryIconKey,
	type ContentCategory,
} from "@/features/content/lib/category";
import { ImageUpload } from "@/features/admin";
import {
	categoryFormAction,
	deleteCategoryAction,
	type ContentFormState,
} from "@/features/content/server/content.actions";

type Draft = {
	label: string;
	title: string;
	icon: CategoryIconKey;
	imageUrl: string;
};

const emptyDraft: Draft = { label: "", title: "", icon: "grid", imageUrl: "" };

const initialState: ContentFormState = {};

export function CategoriesManager({
	categories,
}: {
	categories: ContentCategory[];
}) {
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
			const result = await categoryFormAction(initialState, formData);
			if (result.success) {
				resetForm();
			} else {
				setState(result);
			}
		});
	};

	const handleEdit = (category: ContentCategory) => {
		setEditingId(category.id);
		setDraft({
			label: category.label,
			title: category.title,
			icon: category.icon,
			imageUrl: category.imageUrl ?? "",
		});
		setState(initialState);
		setFormKey((key) => key + 1);
	};

	const handleDelete = (id: string) => {
		startTransition(async () => {
			await deleteCategoryAction(id);
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
								<Label>Category image</Label>
								<input type='hidden' name='imageUrl' value={draft.imageUrl} />
								<ImageUpload
									key={formKey}
									label='Upload image'
									hint='Optional square image'
									value={draft.imageUrl || null}
									onChange={(value) => update("imageUrl", value ?? "")}
								/>
							</div>
							<div className='flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='category-title'>Section title</Label>
									<Input
										id='category-title'
										name='title'
										value={draft.title}
										onChange={(event) => update("title", event.target.value)}
										placeholder='e.g. Best phone deals'
									/>
									<p className='text-xs text-muted-foreground'>
										Heading shown above this category on the storefront.
									</p>
								</div>
								<input type='hidden' name='icon' value={draft.icon} />
								<div className='flex flex-col gap-2'>
									<Label htmlFor='category-label'>Name</Label>
									<Input
										id='category-label'
										name='label'
										value={draft.label}
										onChange={(event) => update("label", event.target.value)}
										placeholder='e.g. Powerbanks'
										aria-invalid={Boolean(fieldErrors.label)}
									/>
									{fieldErrors.label?.[0] ? (
										<p className='text-xs text-danger'>{fieldErrors.label[0]}</p>
									) : null}
								</div>
								<div className='flex flex-wrap items-center justify-between gap-3'>
									<p className='text-xs text-muted-foreground'>
										URL slug:{" "}
										<span className='font-medium text-foreground'>
											{draft.label.trim().toLowerCase().replace(/\s+/g, "-") ||
												"—"}
										</span>
									</p>
									<div className='flex gap-2'>
										{editingId ? (
											<Button
												type='button'
												variant='outline'
												onClick={resetForm}>
												Cancel
											</Button>
										) : null}
										<Button type='submit' disabled={isPending}>
											<Plus />
											{isPending
												? "Saving…"
												: editingId
													? "Save changes"
													: "Add category"}
										</Button>
									</div>
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

			<div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
				{categories.map((category) => {
					const Icon = categoryIcons[category.icon];
					return (
						<Card key={category.id}>
							<CardContent className='flex items-center gap-3'>
								<span className='flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-100 text-brand-700 ring-1 ring-brand-300/60'>
									{category.imageUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img
											src={category.imageUrl}
											alt={category.label}
											className='h-full w-full object-contain p-1'
										/>
									) : (
										<Icon className='size-5' />
									)}
								</span>
								<div className='min-w-0 flex-1'>
									<p className='truncate font-medium'>{category.label}</p>
									<p className='truncate text-xs text-muted-foreground'>
										/{category.slug}
									</p>
								</div>
								<div className='flex gap-1'>
									<Button
										variant='ghost'
										size='icon-sm'
										aria-label='Edit category'
										onClick={() => handleEdit(category)}>
										<Pencil />
									</Button>
									<Button
										variant='ghost'
										size='icon-sm'
										aria-label='Delete category'
										disabled={isPending}
										onClick={() => handleDelete(category.id)}>
										<Trash2 />
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</>
	);
}
