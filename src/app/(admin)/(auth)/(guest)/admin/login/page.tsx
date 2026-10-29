import type { Metadata } from "next";
import { Link, siteConfig } from "@/shared";
import { AdminLoginForm, AuthShell } from "@/features/auth";

export const metadata: Metadata = {
	title: "Admin sign in",
};

export default function AdminLoginPage() {
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
