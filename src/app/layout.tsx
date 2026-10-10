import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/globals.css";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TechNest | Gadgets & Tech Essentials",
	description:
		"Discover the latest gadgets at TechNest. Shop smartphones, wearables, audio, smart home devices and more — quality tech at great prices with fast delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang='en' className={dmSans.variable}>
		<body>{children}</body>
		</html>
	);
}
