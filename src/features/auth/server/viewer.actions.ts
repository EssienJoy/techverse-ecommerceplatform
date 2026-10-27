"use server";

import type { UserRole } from "../schema";
import { getCurrentUser } from "./user.service";

export async function getViewerRoleAction(): Promise<UserRole | null> {
	const user = await getCurrentUser();
	return user?.role ?? null;
}
