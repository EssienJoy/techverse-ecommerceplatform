import type { Metadata } from "next";
import { Header } from "./components";
export const metadata: Metadata = {
	title: "Home | Gadgets & Tech Essentials",
	description:
		"Discover the latest gadgets at TechNest. Shop smartphones, wearables, audio, smart home devices and more — quality tech at great prices with fast delivery.",
};

export default function HomeLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<Header />

			{children}
		</>
	);
}
