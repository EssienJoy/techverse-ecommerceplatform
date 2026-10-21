import { create } from "zustand";

export type AlertVariant = "success" | "error" | "info";

export type Alert = {
	id: string;
	variant: AlertVariant;
	message: string;
};

type AlertStore = {
	alerts: Alert[];
	show: (variant: AlertVariant, message: string, duration?: number) => string;
	success: (message: string, duration?: number) => string;
	error: (message: string, duration?: number) => string;
	dismiss: (id: string) => void;
	clear: () => void;
};

const MAX_VISIBLE_ALERTS = 3;

const createId = () =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useAlertStore = create<AlertStore>((set, get) => ({
	alerts: [],
	show: (variant, message, duration = 5000) => {
		const id = createId();

		set((state) => ({
			alerts: [...state.alerts, { id, variant, message }].slice(
				-MAX_VISIBLE_ALERTS,
			),
		}));

		if (duration > 0) {
			setTimeout(() => get().dismiss(id), duration);
		}

		return id;
	},
	success: (message, duration) => get().show("success", message, duration),
	error: (message, duration) => get().show("error", message, duration),
	dismiss: (id) =>
		set((state) => ({
			alerts: state.alerts.filter((alert) => alert.id !== id),
		})),
	clear: () => set({ alerts: [] }),
}));

export const alert = {
	success: (message: string, duration?: number) =>
		useAlertStore.getState().success(message, duration),
	error: (message: string, duration?: number) =>
		useAlertStore.getState().error(message, duration),
	info: (message: string, duration?: number) =>
		useAlertStore.getState().show("info", message, duration),
	dismiss: (id: string) => useAlertStore.getState().dismiss(id),
};
