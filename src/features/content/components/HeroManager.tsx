"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Input } from "@/shared";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import type { HeroSlide } from "@/features/content/lib/banner";
import { ImageUpload } from "@/features/admin";
import {
	heroFormAction,
	deleteHeroAction,
	type ContentFormState,
} from "@/features/content/server/content.actions";

type Draft = {
	tag: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	href: string;
	active: boolean;
};

const emptyDraft: Draft = {
	tag: "",
	title: "",
	subtitle: "",
	imageUrl: "",
	href: "/shop",
	active: true,
};

const initialState: ContentFormState = {};

export function HeroManager({ slides }: { slides: HeroSlide[] }) {
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
		if (draft.active) formData.set("active", "on");

		startTransition(async () => {
			const result = await heroFormAction(initialState, formData);
			if (result.success) {
				resetForm();
			} else {
				setState(result);
			}
		});
	};

	const handleEdit = (slide: HeroSlide) => {
		setEditingId(slide.id);
		setDraft({
			tag: slide.tag,
			title: slide.title,
			subtitle: slide.subtitle,
			imageUrl: slide.imageUrl,
			href: slide.href,
			active: slide.active,
		});
		setState(initialState);
		setFormKey((key) => key + 1);
	};

	const handleDelete = (id: string) => {
		startTransition(async () => {
			await deleteHeroAction(id);
		});
	};

	const fieldErrors = state.fieldErrors ?? {};

	return (
		<>
			<Card>
				<CardContent>
					<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
						<div className='grid gap-4 lg:grid-cols-[220px_1fr]'>
							<div className='flex flex-col gap-2'>
								<Label>Slide image</Label>
								<input type='hidden' name='imageUrl' value={draft.imageUrl} />
								<ImageUpload
									key={formKey}
									label='Upload image'
									hint='Wide image, 4:3 recommended'
									value={draft.imageUrl || null}
									onChange={(value) => update("imageUrl", value ?? "")}
								/>
							</div>

							<div className='flex flex-col gap-4'>
								<div className='grid gap-4 sm:grid-cols-2'>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='hero-tag'>Tag</Label>
										<Input
											id='hero-tag'
											name='tag'
											value={draft.tag}
											onChange={(event) => update("tag", event.target.value)}
											placeholder='e.g. New in'
										/>
									</div>
									<div className='flex flex-col gap-2'>
										<Label htmlFor='hero-href'>Link</Label>
										<Input
											id='hero-href'
											name='href'
											value={draft.href}
											onChange={(event) => update("href", event.target.value)}
											placeholder='/shop'
										/>
									</div>
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='hero-title'>Title</Label>
									<Input
										id='hero-title'
										name='title'
										value={draft.title}
										onChange={(event) => update("title", event.target.value)}
										placeholder='Slide headline'
										aria-invalid={Boolean(fieldErrors.title)}
									/>
									{fieldErrors.title?.[0] ? (
										<p className='text-xs text-danger'>{fieldErrors.title[0]}</p>
									) : null}
								</div>
								<div className='flex flex-col gap-2'>
									<Label htmlFor='hero-subtitle'>Subtitle</Label>
									<Input
										id='hero-subtitle'
										name='subtitle'
										value={draft.subtitle}
										onChange={(event) =>
											update("subtitle", event.target.value)
										}
										placeholder='Short supporting text'
									/>
								</div>
								<div className='flex flex-wrap items-center justify-between gap-3'>
									<div className='flex items-center gap-2 text-sm'>
										<Switch
											checked={draft.active}
											onCheckedChange={(checked) =>
												update("active", checked)
											}
										/>
										Active
									</div>
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
													: "Add slide"}
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

			<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
				{slides.map((slide) => (
					<Card key={slide.id}>
						<CardContent className='flex flex-col gap-3'>
							<div className='relative overflow-hidden rounded-xl border border-border'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={slide.imageUrl || "/hero.jpg"}
									alt={slide.title}
									className='h-32 w-full object-contain'
								/>
								<span className='absolute top-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm'>
									{slide.tag || "Slide"}
								</span>
								<Badge
									variant={slide.active ? "secondary" : "outline"}
									className='absolute top-2 right-2'>
									{slide.active ? "Active" : "Hidden"}
								</Badge>
							</div>
							<div className='min-w-0'>
								<p className='font-medium'>{slide.title}</p>
								<p className='mt-0.5 line-clamp-2 text-xs text-muted-foreground'>
									{slide.subtitle}
								</p>
							</div>
							<div className='flex justify-end gap-1'>
								<Button
									variant='ghost'
									size='icon-sm'
									aria-label='Edit slide'
									onClick={() => handleEdit(slide)}>
									<Pencil />
								</Button>
								<Button
									variant='ghost'
									size='icon-sm'
									aria-label='Delete slide'
									disabled={isPending}
									onClick={() => handleDelete(slide.id)}>
									<Trash2 />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</>
	);
}
