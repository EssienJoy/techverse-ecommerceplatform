import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AlertMessage, ThemeProvider } from "@/shared";
import { Suspense } from "react";

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
					<Suspense fallback={null}>{children}</Suspense>
				</ThemeProvider>
			</body>
		</html>
	);
}

// Product

// Product Category

// Brand

// Product Variation

// Product Image

// Inventory

// Supplier

// Shopping Cart

// Cart Item

// Wishlist

// Customer

// User

// Admin

// Address

// Order

// Order Item

// Payment

// Refund

// Shipment

// Delivery

// Coupon

// Discount

// Promotion

// Product Review

// Product Rating

// Product Question

// Return

// Exchange

// Warranty

// Invoice

// Receipt

// Tax

// Shipping Method

// Shipping Zone

// Notification

// Customer Support Ticket

// Support Message

// Search History

// Recently Viewed Product

// Product Comparison

// Product Bundle

// Gift Card

// Store Credit

// Loyalty Program

// Loyalty Transaction

// Referral

// Advertisement Banner

// Store Page / Content

// Blog Post

// FAQ

// Store Settings

// Admin Role

// Permission

// Audit Log

// Analytics Event

// Stock Movement

// Purchase Order

// Supplier Invoice

// Payment Transaction

// Currency

// Exchange Rate

// Tax Rule

// Return Request

// Refund Transaction

// Delivery Tracking Event

// Newsletter Subscription

// Marketing Campaign

// Abandoned Cart

// Fraud Report

// Activity Log
