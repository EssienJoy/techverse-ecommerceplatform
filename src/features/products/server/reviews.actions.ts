"use server";

import { revalidatePath } from "next/cache";
import { productReviewInputSchema } from "@/shared/lib";
import { addProductReview } from "./products.service";

export type ReviewFormState = {
	success?: boolean;
	formError?: string | null;
	fieldErrors?: Record<string, string[]>;
};

export async function createReviewAction(
	_prevState: ReviewFormState,
	formData: FormData,
): Promise<ReviewFormState> {
	const parsed = productReviewInputSchema.safeParse({
		productId: String(formData.get("productId") ?? "").trim(),
		rating: formData.get("rating") ?? 0,
		reviewerName: String(formData.get("reviewerName") ?? "").trim() || undefined,
		title: String(formData.get("title") ?? "").trim() || undefined,
		body: String(formData.get("body") ?? "").trim(),
	});

	if (!parsed.success) {
		return { fieldErrors: parsed.error.flatten().fieldErrors };
	}

	try {
		await addProductReview(parsed.data);
	} catch {
		return { formError: "Could not submit your review. Please try again." };
	}

	revalidatePath(`/product/${parsed.data.productId}`);
	revalidatePath("/shop");
	revalidatePath("/");

	return { success: true };
}
