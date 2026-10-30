import { z } from "zod";
import { themeSchema } from "@/shared/lib/theme";

export const notificationKeySchema = z.enum([
	"orderUpdates",
	"promotions",
	"newsletter",
]);

export const notificationSettingsSchema = z.object({
	orderUpdates: z.boolean(),
	promotions: z.boolean(),
	newsletter: z.boolean(),
});

export const settingsSchema = z.object({
	theme: themeSchema,
	notifications: notificationSettingsSchema,
});

export const addressInputSchema = z.object({
	label: z
		.string()
		.trim()
		.min(1, "Add a label, like Home or Work.")
		.max(24, "Keep the label short."),
	fullName: z.string().trim().min(2, "Enter the recipient's full name."),
	phone: z
		.string()
		.trim()
		.min(7, "Enter a phone number.")
		.max(20, "Enter a shorter phone number."),
	address: z.string().trim().min(5, "Enter the street address.").max(120),
	city: z.string().trim().min(1, "Enter the city.").max(60),
	postalCode: z.string().trim().max(20).optional(),
});

export const addressSchema = addressInputSchema.extend({
	id: z.string().min(1),
	isDefault: z.boolean(),
});

export const cardBrandSchema = z.enum([
	"visa",
	"mastercard",
	"verve",
	"amex",
	"other",
]);

export const savedCardInputSchema = z.object({
	cardholder: z.string().trim().min(2, "Enter the name on the card.").max(60),
	brand: cardBrandSchema,
	last4: z
		.string()
		.trim()
		.regex(/^\d{4}$/, "Enter the last four digits only."),
	expiry: z
		.string()
		.trim()
		.regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY, for example 08/28."),
});

export const savedCardSchema = savedCardInputSchema.extend({
	id: z.string().min(1),
	isDefault: z.boolean(),
});

export const cardBrandLabels: Record<CardBrand, string> = {
	visa: "Visa",
	mastercard: "Mastercard",
	verve: "Verve",
	amex: "American Express",
	other: "Card",
};

export type NotificationKey = z.infer<typeof notificationKeySchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AddressInput = z.infer<typeof addressInputSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CardBrand = z.infer<typeof cardBrandSchema>;
export type SavedCardInput = z.infer<typeof savedCardInputSchema>;
export type SavedCard = z.infer<typeof savedCardSchema>;
