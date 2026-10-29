import type { Metadata } from "next";
import { Link, siteConfig } from "@/shared";
import { AuthShell, NormalSignupForm } from "@/features/auth";
import { safeRedirectPath, withNext } from "@/features/auth/lib/redirect";

export const metadata: Metadata = {
	title: "Create account",
};

export default async function NormalSignupPage({
	searchParams,
}: {
	searchParams: Promise<{ next?: string }>;
}) {
	const next = safeRedirectPath((await searchParams).next);

	return (
		<AuthShell
			variant='customer'
			title='Create your account'
			description={`Save favourites, track orders and check out faster at ${siteConfig.name}.`}
			footer={
				<>
					Already have an account?{" "}
					<Link
						href={withNext("/login", next)}
						className='font-medium hover:underline'>
						Sign in
					</Link>
				</>
			}>
			<NormalSignupForm next={next} />
		</AuthShell>
	);
}
