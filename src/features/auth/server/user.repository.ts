import "server-only";
import { prisma } from "@/prisma-client/prisma";

export async function findUserByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
	return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: {
	name?: string | null;
	email: string;
	password: string;
	role?: "user" | "admin" | "super_admin";
}) {
	return prisma.user.create({ data });
}

export async function updateMe(
	id: string,
	data: {
		email?: string;
		name?: string | null;
		password?: string;
		role?: "user" | "admin" | "super_admin";
		isActive?: boolean;
	},
) {
	return prisma.user.update({ where: { id }, data });
}

export async function deleteMe(id: string) {
	return prisma.user.delete({ where: { id } });
}
