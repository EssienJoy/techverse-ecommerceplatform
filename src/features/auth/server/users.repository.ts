import "server-only";
import { prisma } from "@/prisma-client/prisma";

export function findUserByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } });
}

export function createUserRecord(data: {
	name: string;
	email: string;
	password: string;
	role: "admin" | "super_admin";
}) {
	return prisma.user.create({ data });
}
