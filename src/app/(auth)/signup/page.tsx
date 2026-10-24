import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link, siteConfig } from "@/shared";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { NormalSignupForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Create account",
};

export default async function NormalSignupPage() {
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
				<CardTitle>Create account</CardTitle>
				<CardDescription>Sign up to shop at {siteConfig.name}.</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<NormalSignupForm />
				<p className='text-center text-sm text-muted-foreground'>
					<Link href='/login'>Already have an account? Sign in</Link>
				</p>
			</CardContent>
		</Card>
	);
}
