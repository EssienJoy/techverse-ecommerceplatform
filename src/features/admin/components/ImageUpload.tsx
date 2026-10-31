"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared";
import { validateImageFile } from "@/shared/lib";

type ImageUploadProps = {
	label?: string;
	hint?: string;
	className?: string;
	name?: string;
	value?: string | null;
	onChange?: (value: string | null) => void;
	compact?: boolean;
};

export function ImageUpload({
	label = "Upload image",
	hint = "PNG, JPG, WEBP or AVIF up to 5MB",
	className,
	name = "imageFile",
	value,
	onChange,
	compact = false,
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const objectUrlRef = useRef<string | null>(null);
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(
		() => () => {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		},
		[],
	);

	const preview = pendingUrl ?? value ?? null;

	const clearPending = () => {
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
		setPendingUrl(null);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const validationError = validateImageFile(file);
		if (validationError) {
			setError(validationError);
			if (inputRef.current) inputRef.current.value = "";
			return;
		}

		setError(null);
		clearPending();

		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		setPendingUrl(url);
	};

	const handleClear = () => {
		clearPending();
		setError(null);
		if (inputRef.current) inputRef.current.value = "";
		onChange?.(null);
	};

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<input
				ref={inputRef}
				type='file'
				name={name}
				accept='image/*'
				className='hidden'
				onChange={handleChange}
			/>
			{preview ? (
				<div className='relative overflow-hidden rounded-2xl border border-border'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={preview}
						alt='Selected preview'
						className={cn(
							"w-full object-contain",
							compact ? "h-28" : "h-40",
						)}
					/>
					<Button
						variant='ghost'
						size='icon-sm'
						aria-label='Remove image'
						className='absolute top-2 right-2'
						onClick={handleClear}>
						<X />
					</Button>
				</div>
			) : (
				<button
					type='button'
					onClick={() => inputRef.current?.click()}
					className={cn(
						"flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card text-muted-foreground transition-colors hover:bg-muted",
						compact ? "h-28 gap-1" : "h-40",
					)}>
					<ImagePlus className={cn("text-primary", compact ? "size-5" : "size-6")} />
					<span className='text-sm font-medium text-foreground'>{label}</span>
					<span className='text-xs'>{hint}</span>
				</button>
			)}
			{pendingUrl ? (
				<div className='flex flex-col gap-2'>
					<p className='text-xs text-muted-foreground'>
						Uploads when you save.
					</p>
					<label className='flex cursor-pointer items-center gap-2 text-xs font-medium'>
						<input
							type='checkbox'
							name='removeBackground'
							value='true'
							className='size-4 accent-primary'
						/>
						Remove background (AI)
					</label>
				</div>
			) : null}
			{error ? <p className='text-xs text-danger'>{error}</p> : null}
		</div>
	);
}
