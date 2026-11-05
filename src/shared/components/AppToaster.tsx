"use client";

import { Toaster } from "react-hot-toast";

const baseStyle = {
	background: "var(--card)",
	color: "var(--foreground)",
	border: "1px solid var(--border)",
	borderRadius: "var(--radius-lg, 0.75rem)",
	boxShadow: "var(--primitive-shadow-md)",
	fontSize: "0.875rem",
	lineHeight: "1.5",
	maxWidth: "calc(100vw - var(--space-8))",
	padding: "var(--space-3) var(--space-4)",
} as const;

export function AppToaster() {
	return (
		<Toaster
			position='top-center'
			gutter={8}
			containerStyle={{ top: 16 }}
			toastOptions={{
				duration: 5000,
				style: baseStyle,
				success: {
					style: {
						background: "var(--success-muted)",
						borderColor: "var(--success-border)",
						color: "var(--success-foreground)",
					},
					iconTheme: {
						primary: "var(--success)",
						secondary: "var(--success-muted)",
					},
				},
				error: {
					style: {
						background: "var(--danger-muted)",
						borderColor: "var(--danger-border)",
						color: "var(--danger-foreground)",
					},
					iconTheme: {
						primary: "var(--danger)",
						secondary: "var(--danger-muted)",
					},
				},
			}}
		/>
	);
}
