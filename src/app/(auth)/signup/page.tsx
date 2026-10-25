import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Link, siteConfig } from "@/shared";
import { AuthShell, NormalSignupForm } from "@/features/auth";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: "Create account",
};

export default async function NormalSignupPage() {
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
			title='Create your account'
			description={`Save favourites, track orders and check out faster at ${siteConfig.name}.`}
			footer={
				<>
					Already have an account?{" "}
					<Link href='/login' className='font-medium hover:underline'>
						Sign in
					</Link>
				</>
			}>
			<NormalSignupForm />
		</AuthShell>
	);
}
