import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";

/**
 * Sign-in and sign-up pages are for visitors who are not signed in.
 * Anyone with a valid account is sent to where they belong instead.
 *
 * The check runs behind a Suspense boundary with no fallback, so nothing from
 * these pages is shown until it has passed.
 */
export default function GuestOnlyLayout({ children }: { children: ReactNode }) {
	return (
		<Suspense fallback={null}>
			<GuestGate>{children}</GuestGate>
		</Suspense>
	);
}

async function GuestGate({ children }: { children: ReactNode }) {
	const user = await getCurrentUser();

	if (user) {
		redirect(user.role === "user" ? "/" : "/admin");
	}

	return children;
}
