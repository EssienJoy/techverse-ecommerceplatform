"use client";

import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { cn } from "cn";
import { useAlertStore, type AlertVariant } from "../stores/useAlertStore";

const variantStyles: Record<
	AlertVariant,
	{ container: string; icon: string; Icon: typeof Info }
> = {
	success: {
		container:
			"border-success-border bg-success-muted text-success-foreground",
		icon: "text-success",
		Icon: CircleCheck,
	},
	error: {
		container: "border-danger-border bg-danger-muted text-danger-foreground",
		icon: "text-danger",
		Icon: CircleAlert,
	},
	info: {
		container: "border-border bg-card text-foreground",
		icon: "text-brand-600",
		Icon: Info,
	},
};

export function AlertMessage() {
	const alerts = useAlertStore((state) => state.alerts);
	const dismiss = useAlertStore((state) => state.dismiss);

	return (
		<div
			aria-live='polite'
			aria-atomic='false'
			className='pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-80'>
			{alerts.map((entry) => {
				const { container, icon, Icon } = variantStyles[entry.variant];

				return (
					<div
						key={entry.id}
						role={entry.variant === "error" ? "alert" : "status"}
						className={cn(
							"pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-lg shadow-black/5 animate-in fade-in slide-in-from-top-2 duration-200",
							container,
						)}>
						<Icon className={cn("mt-0.5 size-4 shrink-0", icon)} />

						<p className='flex-1 text-sm leading-5 font-medium'>
							{entry.message}
						</p>

						<button
							type='button'
							aria-label='Dismiss notification'
							onClick={() => dismiss(entry.id)}
							className='-mr-1 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100'>
							<X className='size-4' />
						</button>
					</div>
				);
			})}
		</div>
	);
}
