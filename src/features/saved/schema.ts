import { z } from "zod";

export const savedItemSchema = z.object({
	id: z.string().min(1),
	productId: z.string().min(1),
	name: z.string().min(1),
	price: z.number().nonnegative(),
	imageUrl: z.string().optional(),
});

export type SavedItem = z.infer<typeof savedItemSchema>;
