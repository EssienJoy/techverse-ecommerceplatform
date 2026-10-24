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
import { AdminSignupForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Create admin account",
};

export default async function AdminSignupPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/admin/login");
	}

	if (user.role !== "super_admin") {
		redirect("/admin");
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create admin account</CardTitle>
				<CardDescription>
					Only super admins can create admin accounts for {siteConfig.name}.
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<AdminSignupForm />
				<p className='text-center text-sm text-muted-foreground'>
					<Link href='/admin'>Back to dashboard</Link>
				</p>
			</CardContent>
		</Card>
	);
}
