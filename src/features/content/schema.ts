import { z } from "zod";

export const heroSlideSchema = z.object({
	id: z.string(),
	tag: z.string(),
	title: z.string(),
	subtitle: z.string(),
	imageUrl: z.string(),
	href: z.string(),
	isActive: z.boolean(),
});
