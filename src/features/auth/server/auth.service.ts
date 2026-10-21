import "server-only";
import type { CreateUserInput, SessionUser } from "@/shared/lib";
import { hashPassword } from "./password";
import { createUserRecord, findUserByEmail } from "./users.repository";

type CreateAdminResult =
	| { ok: true; user: SessionUser }
	| { ok: false; error: string };

export async function createAdminUser(
	input: CreateUserInput,
	actor: SessionUser | null,
): Promise<CreateAdminResult> {
	if (actor?.role !== "super_admin") {
		return {
			ok: false,
			error: "Only a super admin can create admin accounts.",
		};
	}

	const email = input.email.trim().toLowerCase();
	const existing = await findUserByEmail(email);

	if (existing) {
		return {
			ok: false,
			error: "An account with that email already exists.",
		};
	}

	const user = await createUserRecord({
		name: input.name.trim(),
		email,
		password: await hashPassword(input.password),
		role: "admin",
	});

	return {
		ok: true,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	};
}
