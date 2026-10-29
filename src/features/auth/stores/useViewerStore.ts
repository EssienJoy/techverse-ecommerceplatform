import { create } from "zustand";
import { alert } from "@/shared";

export const ADMIN_SHOPPING_MESSAGE =
	"Admin accounts can't shop. Sign in with a customer account to continue.";

type ViewerState = {
	isAdmin: boolean;
	setIsAdmin: (isAdmin: boolean) => void;
};

export const useViewerStore = create<ViewerState>((set) => ({
	isAdmin: false,
	setIsAdmin: (isAdmin) => set({ isAdmin }),
}));

/** Returns true (and tells the user why) when the viewer can't shop. */
export function blockAdminShopping(): boolean {
	if (!useViewerStore.getState().isAdmin) return false;

	alert.error(ADMIN_SHOPPING_MESSAGE);
	return true;
}
