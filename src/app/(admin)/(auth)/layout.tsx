import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/shared";

export const metadata: Metadata = {
	title: `Admin account | ${siteConfig.name}`,
	description: `Sign in to manage ${siteConfig.name}.`,
};

export const instant = false;

/**
 * Admin auth pages. They live in `(admin)/(auth)`, outside
 * `(admin)/admin/layout.tsx`, so the admin guard can't redirect them to
 * `/admin/login` while someone is trying to sign in.
 */
export default function AdminAuthLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <main className='min-h-dvh bg-background'>{children}</main>;
}
