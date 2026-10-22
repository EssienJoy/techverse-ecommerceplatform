import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AlertMessage, ThemeProvider } from "@/shared";

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	viewportFit: "cover",
};

export const metadata: Metadata = {
	title: {
		template: "%s | Gadgets & Tech Essentials",
		default: "TechNest | Gadgets & Tech Essentials",
	},
	description:
		"Discover the latest gadgets at TechNest. Shop smartphones, wearables, audio, smart home devices and more — quality tech at great prices with fast delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html lang='en' className={dmSans.variable}>
			<body>
				<ThemeProvider>
					<AlertMessage />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
