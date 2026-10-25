import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link, siteConfig } from "@/shared";
import { AuthShell, NormalLoginForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Sign in",
};

export default async function NormalLoginPage() {
	const user = await getCurrentUser();

	if (user) {
		if (user.role === "user") {
			redirect("/");
		}
		redirect("/admin");
	}

	return (
		<AuthShell
			variant='customer'
			title='Welcome back'
			description={`Sign in to your ${siteConfig.name} account to continue shopping.`}
			footer={
				<>
					New to {siteConfig.name}?{" "}
					<Link href='/signup' className='font-medium hover:underline'>
						Create an account
					</Link>
				</>
			}>
			<NormalLoginForm />
		</AuthShell>
	);
}
