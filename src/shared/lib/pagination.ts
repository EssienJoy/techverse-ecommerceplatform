import { z } from "zod";

export function paginatedResponseSchema<T extends z.ZodType>(item: T) {
	return z.object({
		items: z.array(item),
		page: z.number().int().nonnegative(),
		pageSize: z.number().int().positive(),
		total: z.number().int().nonnegative(),
	});
}

export type PaginatedResponse<T> = {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
};
