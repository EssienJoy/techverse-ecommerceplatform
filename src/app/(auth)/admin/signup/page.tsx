import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Link, siteConfig } from "@/shared";
import { AdminSignupForm, AuthShell } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Create admin account",
};

export default async function AdminSignupPage() {
	const user = await getCurrentUser();
	if (!user) redirect("/admin/login");

	if (user.role === "user") {
		redirect("/");
	}

	if (user.role !== "super_admin") {
		redirect("/admin");
	}

	return (
		<AuthShell
			variant='admin'
			title='Create admin account'
			description={`Only super admins can add admins to ${siteConfig.name}. Share the temporary password securely.`}
			footer={
				<Link
					href='/admin'
					className='inline-flex items-center gap-1.5 font-medium hover:underline'>
					<ArrowLeft className='size-4' aria-hidden />
					Back to dashboard
				</Link>
			}>
			<AdminSignupForm />
		</AuthShell>
	);
}
