"use client";

import { useRef, useState } from "react";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Button, Input } from "@/shared";
import type { ProductVariationInput } from "@/features/products/schema";
import { Label } from "@/shared/components/ui/label";
import { cn } from "cn";
import { uploadImageAction } from "../server/uploads.actions";

type FeatureEditorProps = {
	features: string[];
	onAdd: (feature: string) => void;
	onRemove: (index: number) => void;
};

export function ProductFeaturesEditor({
	features,
	onAdd,
	onRemove,
}: FeatureEditorProps) {
	const [draft, setDraft] = useState("");

	const addFeature = () => {
		const feature = draft.trim();
		if (!feature) return;
		onAdd(feature);
		setDraft("");
	};

	return (
		<section className='flex flex-col gap-2'>
			<Label>Features</Label>
			<div className='flex gap-2'>
				<Input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							addFeature();
						}
					}}
					placeholder='e.g. 5G ready'
				/>
				<Button type='button' variant='outline' onClick={addFeature}>
					<Plus />
					Add
				</Button>
			</div>
			{features.length > 0 ? (
				<ul className='flex flex-wrap gap-2'>
					{features.map((feature, index) => (
						<li
							key={`${feature}-${index}`}
							className='flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium'>
							{feature}
							<button
								type='button'
								aria-label={`Remove ${feature}`}
								onClick={() => onRemove(index)}
								className='text-muted-foreground transition-colors hover:text-foreground'>
								<X className='size-3' />
							</button>
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}

type VariationsEditorProps = {
	variations: ProductVariationInput[];
	onChange: (variations: ProductVariationInput[]) => void;
};

const emptyVariation: ProductVariationInput = {
	sku: "",
	color: "",
	size: "",
	price: 0,
	stock: 0,
	features: [],
	images: [],
};

function VariationImages({
	images,
	onChange,
	removeBackground,
}: {
	images: string[];
	onChange: (images: string[]) => void;
	removeBackground: boolean;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFiles = async (files: FileList | null) => {
		if (!files || files.length === 0) return;

		setError(null);
		setUploading(true);

		const uploaded: string[] = [];
		for (const file of Array.from(files)) {
			const formData = new FormData();
			formData.set("file", file);
			formData.set("removeBackground", removeBackground ? "true" : "false");
			const result = await uploadImageAction(formData);
			if (result.ok) {
				uploaded.push(result.url);
			} else {
				setError(result.error);
			}
		}

		if (uploaded.length > 0) onChange([...images, ...uploaded]);
		setUploading(false);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<div className='flex flex-col gap-1'>
			<div className='flex flex-wrap items-center gap-1.5'>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					multiple
					className='hidden'
					onChange={(event) => handleFiles(event.target.files)}
				/>
				{images.map((url, index) => (
					<div
						key={`${url}-${index}`}
						className='group/image relative size-8 overflow-hidden rounded-md border border-border bg-white'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={url} alt='Variant' className='size-full object-cover' />
						<button
							type='button'
							aria-label='Remove image'
							onClick={() =>
								onChange(images.filter((_, imageIndex) => imageIndex !== index))
							}
							className='absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity group-hover/image:opacity-100'>
							<X className='size-3' />
						</button>
					</div>
				))}
				<button
					type='button'
					disabled={uploading}
					aria-label='Add variation image'
					onClick={() => inputRef.current?.click()}
					className={cn(
						"flex size-8 items-center justify-center rounded-md border border-dashed border-border bg-card text-muted-foreground transition-colors hover:bg-muted",
						uploading && "opacity-60",
					)}>
					<ImagePlus className='size-3.5 text-primary' />
				</button>
			</div>
			{error ? <p className='text-xs text-danger'>{error}</p> : null}
		</div>
	);
}

export function ProductVariationsEditor({
	variations,
	onChange,
}: VariationsEditorProps) {
	const updateVariation = (
		index: number,
		patch: Partial<ProductVariationInput>,
	) =>
		onChange(
			variations.map((variation, currentIndex) =>
				currentIndex === index ? { ...variation, ...patch } : variation,
			),
		);

	const [removeBackground, setRemoveBackground] = useState(false);

	const addVariation = () =>
		onChange([...variations, { ...emptyVariation, images: [] }]);
	const removeVariation = (index: number) =>
		onChange(variations.filter((_, currentIndex) => currentIndex !== index));

	return (
		<section className='flex flex-col gap-3'>
			<input
				type='hidden'
				name='variations'
				value={JSON.stringify(variations)}
			/>

			<div className='flex items-center justify-between gap-3'>
				<p className='text-xs text-muted-foreground'>
					One row per purchasable color and size combination.
				</p>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={addVariation}>
					<Plus />
					Add variation
				</Button>
			</div>

			<label className='flex w-fit cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground'>
				<input
					type='checkbox'
					checked={removeBackground}
					onChange={(event) => setRemoveBackground(event.target.checked)}
					className='size-4 accent-primary'
				/>
				Remove backgrounds on new images (AI)
			</label>

			{variations.length === 0 ? (
				<div className='flex flex-col items-center gap-1 rounded-lg border border-dashed border-border px-4 py-5 text-center'>
					<p className='text-sm font-medium'>No variations yet</p>
					<p className='text-xs text-muted-foreground'>
						Add at least one variation with its SKU, price and stock.
					</p>
				</div>
			) : (
				<div className='overflow-hidden rounded-lg border border-border'>
					<div className='hidden grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_auto] gap-2 border-b border-border bg-muted/50 px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase lg:grid'>
						<span>SKU</span>
						<span>Color</span>
						<span>Size</span>
						<span>Price</span>
						<span>Stock</span>
						<span className='sr-only'>Images and actions</span>
					</div>

					<div className='divide-y divide-border'>
						{variations.map((variation, index) => (
							<div
								key={index}
								className='grid grid-cols-2 gap-2 px-2.5 py-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_auto] lg:items-center'>
								<Input
									aria-label='SKU'
									placeholder='SKU'
									value={variation.sku}
									onChange={(event) =>
										updateVariation(index, { sku: event.target.value })
									}
									className='col-span-2 lg:col-span-1'
								/>
								<Input
									aria-label='Color'
									placeholder='Color'
									value={variation.color}
									onChange={(event) =>
										updateVariation(index, { color: event.target.value })
									}
								/>
								<Input
									aria-label='Size'
									placeholder='Size'
									value={variation.size}
									onChange={(event) =>
										updateVariation(index, { size: event.target.value })
									}
								/>
								<Input
									aria-label='Price'
									placeholder='Price'
									type='number'
									step='1'
									min='0'
									value={variation.price}
									onChange={(event) =>
										updateVariation(index, {
											price: Number(event.target.value),
										})
									}
								/>
								<Input
									aria-label='Stock'
									placeholder='Stock'
									type='number'
									min='0'
									step='1'
									value={variation.stock}
									onChange={(event) =>
										updateVariation(index, {
											stock: Number(event.target.value),
										})
									}
								/>
								<div className='col-span-2 flex items-center justify-between gap-2 lg:col-span-1 lg:justify-end'>
									<VariationImages
										images={variation.images}
										onChange={(images) => updateVariation(index, { images })}
										removeBackground={removeBackground}
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon-sm'
										aria-label='Remove variation'
										onClick={() => removeVariation(index)}>
										<Trash2 />
									</Button>
								</div>
								<div className='col-span-full border-t border-border/60 pt-2'>
									<ProductFeaturesEditor
										features={variation.features}
										onAdd={(feature) =>
											updateVariation(index, {
												features: [...variation.features, feature],
											})
										}
										onRemove={(featureIndex) =>
											updateVariation(index, {
												features: variation.features.filter(
													(_, currentIndex) =>
														currentIndex !== featureIndex,
												),
											})
										}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
