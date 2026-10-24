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
import { NormalLoginForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Sign in",
};

export default async function NormalLoginPage() {
	const user = await getCurrentUser();

	if (user) {
		if (user.role === "user") {
			redirect("/store");
		}
		redirect("/admin");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign in</CardTitle>
				<CardDescription>Access the {siteConfig.name} store.</CardDescription>
			</CardHeader>
			<CardContent>
				<NormalLoginForm />
			</CardContent>
		</Card>
	);
}
