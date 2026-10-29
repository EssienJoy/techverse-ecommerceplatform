import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { siteConfig } from "@/shared";
import { getCurrentUser } from "@/features/auth/server/user.service";

export const metadata: Metadata = {
	title: `Account | ${siteConfig.name}`,
	description: `Sign in or create your ${siteConfig.name} account.`,
};

export const instant = false;

export default function CustomerAuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<main className='min-h-dvh bg-background'>
			<Suspense fallback={null}>
				<GuestGate>{children}</GuestGate>
			</Suspense>
		</main>
	);
}

/**
 * Sign-in and sign-up are for visitors who are not signed in. Anyone with a
 * valid account is sent to where they belong instead.
 *
 * The check runs behind a Suspense boundary with no fallback, so nothing from
 * these pages is shown until it has passed.
 */
async function GuestGate({ children }: { children: ReactNode }) {
	const user = await getCurrentUser();

	if (user) {
		redirect(user.role === "user" ? "/" : "/admin");
	}

	return children;
}
