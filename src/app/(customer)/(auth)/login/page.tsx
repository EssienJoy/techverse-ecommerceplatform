import type { Metadata } from "next";
import { Link, siteConfig } from "@/shared";
import { AuthShell, NormalLoginForm } from "@/features/auth";
import { safeRedirectPath, withNext } from "@/features/auth/lib/redirect";

export const metadata: Metadata = {
	title: "Sign in",
};

export default async function NormalLoginPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>;
}) {
	const next = safeRedirectPath((await searchParams).next);

	return (
		<AuthShell
			variant='customer'
			title='Welcome back'
			description={
				next?.startsWith("/checkout")
					? "Sign in to continue to checkout."
					: `Sign in to your ${siteConfig.name} account to continue shopping.`
			}
			footer={
				<>
					New to {siteConfig.name}?{" "}
					<Link
						href={withNext("/signup", next)}
						className='font-medium hover:underline'>
						Create an account
					</Link>
				</>
			}>
			<NormalLoginForm next={next} />
		</AuthShell>
	);
}
