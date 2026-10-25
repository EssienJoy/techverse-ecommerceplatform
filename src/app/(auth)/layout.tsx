import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/shared";

export const metadata: Metadata = {
	title: `Account | ${siteConfig.name}`,
	description: `Sign in or create your ${siteConfig.name} account.`,
};

export const instant = false;

export default function AuthLayout({ children }: { children: ReactNode }) {
	return <main className='min-h-dvh bg-background'>{children}</main>;
}
