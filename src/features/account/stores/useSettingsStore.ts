import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsState } from "../types";

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