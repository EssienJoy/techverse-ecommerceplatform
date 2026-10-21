import type { Metadata } from "next";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { siteConfig } from "@/shared";
import { AdminMobileNav, AdminSidebar } from "@/features/admin";
import { getCurrentUser } from "@/features/auth/server/current-user";

export const metadata: Metadata = {
	title: `Admin | ${siteConfig.name}`,
	description: `Manage ${siteConfig.name} products, orders and customers.`,
};

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/admin/login");
	}

	return (
		<div className='flex min-h-screen bg-background'>
			<Suspense fallback={null}>
				<AdminSidebar />
			</Suspense>
			<div className='flex min-w-0 flex-1 flex-col'>{children}</div>
			<Suspense fallback={null}>
				<AdminMobileNav />
			</Suspense>
		</div>
	);
}
