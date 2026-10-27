import { z } from "zod";

export const userRoleSchema = z.enum(["user", "admin", "super_admin"]);

export const sessionUserSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1).nullable(),
	email: z.email(),
	role: userRoleSchema,
});

export const createUserInputSchema = z.object({
	name: z.string().trim().min(1, "Enter your name."),
	email: z.email(),
	password: z.string().min(8),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
