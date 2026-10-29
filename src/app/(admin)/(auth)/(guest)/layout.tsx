import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/server/user.service";

/**
 * The admin sign-in page is for signed-out visitors only. A signed-in account
 * is sent to the console (or to the store, for a customer).
 *
 * `/admin/signup` sits outside this group because super admins use it while
 * signed in.
 */
export default function AdminGuestLayout({
	children,
}: {
	children: ReactNode;
}) {
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
