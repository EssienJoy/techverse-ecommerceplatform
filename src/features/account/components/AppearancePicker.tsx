"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "cn";
import { useTheme, type Theme } from "@/shared";

const themeOptions: {
	value: Theme;
	label: string;
	description: string;
	icon: typeof Sun;
}[] = [
	{
		value: "light",
		label: "Light",
		description: "Always bright",
		icon: Sun,
	},
	{
		value: "dark",
		label: "Dark",
		description: "Easier at night",
		icon: Moon,
	},
	{
		value: "system",
		label: "System",
		description: "Match this device",
		icon: Monitor,
	},
];

export function AppearancePicker() {
	const { theme, setTheme } = useTheme();

	return (
		<section className='rounded-3xl border border-border/80 bg-card p-4 shadow-sm'>
			<div className='grid grid-cols-3 gap-2'>
				{themeOptions.map(({ value, label, description, icon: Icon }) => {
					const selected = theme === value;

					return (
						<button
							key={value}
							type='button'
							aria-pressed={selected}
							onClick={() => setTheme(value)}
							className={cn(
								"flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center transition-colors",
								selected
									? "border-primary bg-primary-subtle text-foreground-primary"
									: "border-border/80 bg-background text-foreground hover:border-primary/40",
							)}>
							<span
								className={cn(
									"flex size-10 items-center justify-center rounded-full",
									selected
										? "bg-primary text-foreground-inverse"
										: "bg-muted text-muted-foreground",
								)}>
								<Icon className='size-5' aria-hidden />
							</span>
							<span className='text-sm font-semibold'>{label}</span>
							<span className='text-[10px] leading-tight text-muted-foreground'>
								{description}
							</span>
						</button>
					);
				})}
			</div>

			<p className='mt-4 rounded-2xl bg-surface-muted px-3 py-3 text-xs leading-relaxed text-muted-foreground'>
				{theme === "system"
					? "The store follows your device's light or dark setting and updates when it changes."
					: `The store stays in ${theme} mode on this device until you change it.`}
			</p>
		</section>
	);
}
