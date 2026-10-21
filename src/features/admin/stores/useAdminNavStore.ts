import { create } from "zustand";

type AdminNavState = {
	isCollapsed: boolean;
	toggle: () => void;
};

export const useAdminNavStore = create<AdminNavState>((set) => ({
	isCollapsed: true,
	toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
