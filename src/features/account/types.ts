import type { LucideIcon } from "lucide-react";
import type { Theme } from "@/shared/lib/schema/theme";
import type { ActionResult } from "@/shared/lib/error";
import type {
	AddressEntry,
	CardBrand,
	NotificationKey,
	NotificationSettings,
	SavedCard,
} from "./schema";

/** The shipping form state used by the account forms. */
export type ProfileFormState = ActionResult;

/** A saved address before it is given an id and a default flag. */
export type AddressDraft = Omit<AddressEntry, "id" | "isDefault">;

/** One row in the "new address" form. */
export type AddressField = {
	name: keyof AddressDraft;
	label: string;
	placeholder: string;
	autoComplete: string;
};

export type ProfileHeaderProps = {
	title: string;
	subtitle?: string;
	/** Pass `false` on the dashboard itself. Every other page points back there. */
	back?: boolean;
};

export type ProfileIdentityProps = {
	name: string | null;
	email: string;
	role: string;
	/** ISO date or Date; shown as the month and year the account was created. */
	memberSince: Date | string;
};

export type MenuItem = {
	href: string;
	label: string;
	description: string;
	icon: LucideIcon;
};

export type MenuGroup = {
	title: string;
	items: MenuItem[];
};

export type ProfileFormProps = {
	defaultValues: { name: string; email: string };
};

/** A text field inside the personal-details form. */
export type ProfileFieldProps = {
	label: string;
	name: string;
	type?: string;
	defaultValue?: string;
	errors?: string[];
	autoComplete?: string;
};

/** A password field inside the password form. */
export type PasswordFieldProps = {
	label: string;
	name: string;
	errors?: string[];
	autoComplete?: string;
};

export type BrandMarkProps = {
	brand: CardBrand;
};

/** One selectable appearance in the theme picker. */
export type ThemeOption = {
	value: Theme;
	label: string;
	description: string;
	icon: LucideIcon;
};

/** One toggle row in the notification settings. */
export type NotificationRow = {
	key: NotificationKey;
	title: string;
	description: string;
};

/** One live count on the profile dashboard. */
export type ProfileStat = {
	href: string;
	label: string;
	value: number;
	icon: LucideIcon;
};

export type AddressState = {
	addresses: AddressEntry[];
	addAddress: (input: AddressDraft) => void;
	removeAddress: (id: string) => void;
	setDefaultAddress: (id: string) => void;
};

export type SettingsState = {
	notifications: NotificationSettings;
	toggleNotification: (key: NotificationKey) => void;
};

export type NewCardInput = {
	last4: string;
	brand: CardBrand;
	expiry: string;
	makeDefault?: boolean;
};

export type WalletState = {
	balance: number;
	cards: SavedCard[];
	addCard: (input: NewCardInput) => void;
	removeCard: (id: string) => void;
	setDefaultCard: (id: string) => void;
};
