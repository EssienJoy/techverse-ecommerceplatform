"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from "react";
import { themeSchema, type Theme } from "@/shared/lib/theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "technest-theme";
const listeners = new Set<() => void>();

function readStoredTheme(): Theme {
	if (typeof window === "undefined") return "light";

	try {
		const parsed = themeSchema.safeParse(
			window.localStorage.getItem(THEME_STORAGE_KEY),
		);

		return parsed.success ? parsed.data : "light";
	} catch {
		// Storage can be unavailable (private mode, blocked cookies); fall back
		// to the default theme rather than breaking the page.
		return "light";
	}
}

function subscribe(listener: () => void) {
	listeners.add(listener);

	const onStorage = (event: StorageEvent) => {
		if (event.key === THEME_STORAGE_KEY) listener();
	};

	window.addEventListener("storage", onStorage);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

function writeTheme(theme: Theme) {
	try {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	} catch {
		// The theme still applies for this session.
	}

	listeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	// The stored theme lives in localStorage, so it is read through an external
	// store. The server snapshot is "light" and React swaps in the stored value
	// after hydration without a setState-in-effect.
	const theme = useSyncExternalStore<Theme>(
		subscribe,
		readStoredTheme,
		() => "light",
	);

	const setTheme = useCallback((next: Theme) => writeTheme(next), []);

	const toggleTheme = useCallback(
		() => writeTheme(readStoredTheme() === "dark" ? "light" : "dark"),
		[],
	);

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
