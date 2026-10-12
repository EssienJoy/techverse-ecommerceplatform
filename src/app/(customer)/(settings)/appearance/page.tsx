"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "cn";
import { useSettingsStore, type Theme } from "@/shared/store/useSettingsStore";

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "dark", label: "Dark", icon: Moon },
	{ value: "system", label: "System", icon: Monitor },
];

export default function AppearancePage() {
	const theme = useSettingsStore((state) => state.theme);
	const setTheme = useSettingsStore((state) => state.setTheme);

	return (
		<section className='mt-4'>
			<p className='text-sm text-muted-foreground'>
				Choose how the store looks to you. System follows your device setting.
			</p>

			<div className='mt-4 grid grid-cols-3 gap-2'>
				{themeOptions.map(({ value, label, icon: Icon }) => {
					const selected = theme === value;
					return (
						<button
							key={value}
							type='button'
							aria-pressed={selected}
							onClick={() => setTheme(value)}
							className={cn(
								"flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-xs font-medium transition-colors",
								selected
									? "border-primary bg-primary/5 text-primary"
									: "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
							)}>
							<Icon className='size-5' />
							{label}
						</button>
					);
				})}
			</div>
		</section>
	);
}