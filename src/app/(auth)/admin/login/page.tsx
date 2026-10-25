import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link, siteConfig } from "@/shared";
import { AdminLoginForm, AuthShell } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Admin sign in",
};

export default async function AdminLoginPage() {
	const user = await getCurrentUser();

	if (user) {
		redirect(user.role === "user" ? "/" : "/admin");
	}

	return (
		<AuthShell
			variant='admin'
			title='Admin sign in'
			description={`Sign in to manage the ${siteConfig.name} store.`}
			footer={
				<>
					Looking to shop?{" "}
					<Link href='/login' className='font-medium hover:underline'>
						Go to customer sign in
					</Link>
				</>
			}>
			<AdminLoginForm />
		</AuthShell>
	);
}
