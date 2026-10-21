import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationKey = "orderUpdates" | "promotions" | "newsletter";

export type NotificationSettings = Record<NotificationKey, boolean>;

type SettingsState = {
	notifications: NotificationSettings;
	toggleNotification: (key: NotificationKey) => void;
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			notifications: {
				orderUpdates: true,
				promotions: false,
				newsletter: true,
			},
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