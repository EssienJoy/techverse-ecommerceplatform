"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared";

type ImageUploadProps = {
	label?: string;
	hint?: string;
	className?: string;
};

export function ImageUpload({
	label = "Upload image",
	hint = "PNG, JPG or WEBP up to 5MB",
	className,
}: ImageUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleClear = () => {
		setPreview(null);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<input
				ref={inputRef}
				type='file'
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
						className='h-40 w-full object-cover'
					/>
					<Button
						variant='ghost'
						size='icon-sm'
						aria-label='Remove image'
						className='absolute top-2 right-2'
						onClick={handleClear}
					>
						<X />
					</Button>
				</div>
			) : (
				<button
					type='button'
					onClick={() => inputRef.current?.click()}
					className='flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card text-muted-foreground transition-colors hover:bg-muted'
				>
					<ImagePlus className='size-6 text-primary' />
					<span className='text-sm font-medium text-foreground'>{label}</span>
					<span className='text-xs'>{hint}</span>
				</button>
			)}
		</div>
	);
}
