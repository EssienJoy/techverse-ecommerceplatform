import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

export type NotificationKey = "orderUpdates" | "promotions" | "newsletter";

export type NotificationSettings = Record<NotificationKey, boolean>;

type SettingsState = {
	theme: Theme;
	notifications: NotificationSettings;
	setTheme: (theme: Theme) => void;
	toggleNotification: (key: NotificationKey) => void;
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			theme: "system",
			notifications: {
				orderUpdates: true,
				promotions: false,
				newsletter: true,
			},
			setTheme: (theme) => set({ theme }),
			toggleNotification: (key) =>
				set((state) => ({
					notifications: {
						...state.notifications,
						[key]: !state.notifications[key],
					},
				})),
		}),
		{ name: "technest-settings" },
	),
);