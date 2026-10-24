import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/shared";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { AdminLoginForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Admin sign in",
};

export default async function AdminLoginPage() {
	const user = await getCurrentUser();

	if (user) {
		redirect("/admin");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>
					Access the {siteConfig.name} admin console.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<AdminLoginForm />
			</CardContent>
		</Card>
	);
}
