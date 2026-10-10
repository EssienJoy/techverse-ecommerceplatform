import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/shared";
import { AdminMobileNav, AdminSidebar } from "./components";

export const metadata: Metadata = {
	title: `Admin | ${siteConfig.name}`,
	description: `Manage ${siteConfig.name} products, orders and customers.`,
};

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<div className='flex min-h-screen bg-surface-muted'>
			<AdminSidebar />
			<main className='flex-1 p-4 pb-24 md:p-6'>{children}</main>
			<AdminMobileNav />
		</div>
	);
}
