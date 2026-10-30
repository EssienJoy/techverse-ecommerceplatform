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
import { THEME_STORAGE_KEY, type Theme } from "@/shared/lib/theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const isTheme = (value: string | null): value is Theme =>
	value === "light" || value === "dark" || value === "system";

const readStoredTheme = (): Theme | null => {
	try {
		const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
		return isTheme(stored) ? stored : null;
	} catch {
		return null;
	}
};

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("light");

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next);

		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, next);
		} catch {
			// Storage can be unavailable in private browsing; the theme still applies.
		}
	}, []);

	const toggleTheme = useCallback(() => {
		setTheme(theme === "dark" ? "light" : "dark");
	}, [setTheme, theme]);

	// The inline script in the root layout applies the stored theme before the
	// first paint. This keeps React's copy of the value in step with it.
	useEffect(() => {
		const stored = readStoredTheme();
		if (stored) setThemeState(stored);
	}, []);

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

	const value = useMemo(
		() => ({ theme, setTheme, toggleTheme }),
		[theme, setTheme, toggleTheme],
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
