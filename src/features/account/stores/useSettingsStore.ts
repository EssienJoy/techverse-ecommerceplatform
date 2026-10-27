import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NotificationKey, NotificationSettings } from "../schema";

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