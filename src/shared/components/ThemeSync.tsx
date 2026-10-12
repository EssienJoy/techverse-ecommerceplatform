"use client";

import { useEffect } from "react";
import { useSettingsStore } from "../store/useSettingsStore";

export function ThemeSync() {
	const theme = useSettingsStore((state) => state.theme);

	useEffect(() => {
		const root = document.documentElement;
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const apply = () => {
			const isDark = theme === "dark" || (theme === "system" && media.matches);
			root.classList.toggle("dark", isDark);
		};

		apply();

		if (theme === "system") {
			media.addEventListener("change", apply);
			return () => media.removeEventListener("change", apply);
		}

		return undefined;
	}, [theme]);

	return null;
}