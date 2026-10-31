"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button, Input, useAlertStore } from "@/shared";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "cn";
import {
	createReviewAction,
	type ReviewFormState,
} from "@/features/products/server/reviews.actions";

const initialState: ReviewFormState = {};

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className='text-xs text-danger'>{message}</p>;
}

type ProductReviewFormProps = {
	productId: string;
	onSubmitted?: () => void;
};

export function ProductReviewForm({
	productId,
	onSubmitted,
}: ProductReviewFormProps) {
	const router = useRouter();
	const [state, formAction, pending] = useActionState(
		createReviewAction,
		initialState,
	);
	const [rating, setRating] = useState(0);
	const [hovered, setHovered] = useState(0);

	const fieldErrors = state.fieldErrors ?? {};
	const showSuccess = useAlertStore((store) => store.success);
	const showError = useAlertStore((store) => store.error);

	useEffect(() => {
		if (state.success) {
			showSuccess("Review posted. Thanks for sharing!");
			router.refresh();
			onSubmitted?.();
			return;
		}

		if (state.formError) showError(state.formError);
	}, [state, showSuccess, showError, router, onSubmitted]);

	return (
		<form
			action={formAction}
			className='flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4'>
			<input type='hidden' name='productId' value={productId} />
			<input type='hidden' name='rating' value={rating} />

			<div className='flex flex-col gap-2'>
				<Label>Your rating</Label>
				<div
					className='flex items-center gap-1'
					onMouseLeave={() => setHovered(0)}>
					{[1, 2, 3, 4, 5].map((value) => {
						const active = value <= (hovered || rating);

						return (
							<button
								key={value}
								type='button'
								aria-label={`${value} star${value === 1 ? "" : "s"}`}
								aria-pressed={rating === value}
								onMouseEnter={() => setHovered(value)}
								onClick={() => setRating(value)}
								className='rounded-md p-1 transition-transform hover:scale-110'>
								<Star
									className={cn(
										"size-6 transition-colors",
										active
											? "fill-amber-400 text-amber-400"
											: "text-border",
									)}
								/>
							</button>
						);
					})}
					<span className='ml-1 text-xs text-muted-foreground'>
						{rating ? `${rating} / 5` : "Select a rating"}
					</span>
				</div>
				<FieldError message={fieldErrors.rating?.[0]} />
			</div>

			<div className='grid gap-3 sm:grid-cols-2'>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='reviewerName'>Name (optional)</Label>
					<Input
						id='reviewerName'
						name='reviewerName'
						placeholder='Your name'
						aria-invalid={Boolean(fieldErrors.reviewerName)}
					/>
					<FieldError message={fieldErrors.reviewerName?.[0]} />
				</div>
				<div className='flex flex-col gap-2'>
					<Label htmlFor='title'>Title (optional)</Label>
					<Input
						id='title'
						name='title'
						placeholder='Summarize your review'
						aria-invalid={Boolean(fieldErrors.title)}
					/>
					<FieldError message={fieldErrors.title?.[0]} />
				</div>
			</div>

			<div className='flex flex-col gap-2'>
				<Label htmlFor='body'>Review</Label>
				<Textarea
					id='body'
					name='body'
					placeholder='Tell others what you think about this product...'
					className='min-h-24'
					aria-invalid={Boolean(fieldErrors.body)}
				/>
				<FieldError message={fieldErrors.body?.[0]} />
			</div>

			<div className='flex justify-end'>
				<Button type='submit' size='sm' disabled={pending}>
					{pending ? "Posting…" : "Post review"}
				</Button>
			</div>
		</form>
	);
}
