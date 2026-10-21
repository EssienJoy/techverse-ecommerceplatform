"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { validateImageFile } from "@/shared/lib";
import { ImageUpload } from "./ImageUpload";

function AddSlideTile({ onSelect }: { onSelect: (url: string) => void }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const validationError = validateImageFile(file);
		if (inputRef.current) inputRef.current.value = "";

		if (validationError) {
			setError(validationError);
			return;
		}

		setError(null);
		onSelect(URL.createObjectURL(file));
	};

	return (
		<>
			<input
				ref={inputRef}
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleChange}
			/>
			<button
				type='button'
				onClick={() => inputRef.current?.click()}
				className='flex h-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-card text-muted-foreground transition-colors hover:bg-muted'>
				<ImagePlus className='size-5 text-primary' />
				<span className='text-[11px] font-medium text-foreground'>
					Add slide
				</span>
				{error ? (
					<span className='px-2 text-center text-[10px] text-danger'>
						{error}
					</span>
				) : null}
			</button>
		</>
	);
}

function SlidePreview({
	image,
	onRemove,
	isMain,
}: {
	image: string;
	onRemove: () => void;
	isMain: boolean;
}) {
	return (
		<div className='relative overflow-hidden rounded-xl border border-border'>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={image} alt='Product slide' className='h-24 w-full object-contain' />
			{isMain ? (
				<span className='absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-foreground-inverse'>
					<Star className='size-2.5 fill-current' />
					Main
				</span>
			) : null}
			<button
				type='button'
				aria-label='Remove slide'
				onClick={onRemove}
				className='absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-background'>
				<X className='size-3.5' />
			</button>
		</div>
	);
}

type ProductImagesProps = {
	className?: string;
	initialMain?: string | null;
	onMainChange?: (url: string | null) => void;
	showGallery?: boolean;
};

export function ProductImages({
	className,
	initialMain = null,
	onMainChange,
	showGallery = true,
}: ProductImagesProps) {
	const [main, setMain] = useState<string | null>(initialMain);
	const [slides, setSlides] = useState<string[]>([]);
	const slidesRef = useRef<string[]>([]);

	useEffect(() => {
		slidesRef.current = slides;
	});

	useEffect(
		() => () => {
			for (const url of slidesRef.current) URL.revokeObjectURL(url);
		},
		[],
	);

	const removeSlide = (index: number) => {
		URL.revokeObjectURL(slides[index]);
		setSlides((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className={className}>
			<div className='flex flex-col gap-2'>
				<Label>Main product image</Label>
				<ImageUpload
					label='Upload main image'
					hint='Required. Shown in the product listings.'
					value={main}
					onChange={(value) => {
						setMain(value);
						onMainChange?.(value);
					}}
				/>
			</div>

			{showGallery ? (
				<div className='mt-5 flex flex-col gap-2'>
					<div className='flex items-baseline justify-between'>
						<Label>Gallery slides</Label>
						<span className='text-xs text-muted-foreground'>
							{slides.length} slide{slides.length === 1 ? "" : "s"}
						</span>
					</div>
					<p className='text-xs text-muted-foreground'>
						Extra images customers can swipe between on the product page.
					</p>
					<div className='mt-1 grid grid-cols-2 gap-3 sm:grid-cols-3'>
						{slides.map((image, index) => (
							<SlidePreview
								key={`${image}-${index}`}
								image={image}
								isMain={index === 0}
								onRemove={() => removeSlide(index)}
							/>
						))}
						<AddSlideTile
							onSelect={(url) => setSlides((prev) => [...prev, url])}
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}
