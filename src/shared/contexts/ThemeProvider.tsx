"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { Theme } from "@/shared/lib/schemas";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");

	const toggleTheme = useCallback(
		() => setTheme((current) => (current === "dark" ? "light" : "dark")),
		[],
	);

	useEffect(() => {
		const root = document.documentElement;
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const apply = () => {
			const isDark =
				theme === "dark" ||
				((theme as unknown as string) === "system" && media.matches);
			root.classList.toggle("dark", isDark);
		};

		apply();

		if ((theme as unknown as string) === "system") {
			media.addEventListener("change", apply);
			return () => media.removeEventListener("change", apply);
		}

		return undefined;
	}, [theme]);

	const value = useMemo(
		() => ({ theme, setTheme, toggleTheme }),
		[theme, toggleTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
}
