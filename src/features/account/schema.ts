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

export const addressEntrySchema = z.object({
	id: z.string().min(1),
	label: z.string().min(1),
	fullName: z.string().min(1),
	phone: z.string().min(1),
	address: z.string().min(1),
	city: z.string().min(1),
	postalCode: z.string().min(1),
	isDefault: z.boolean(),
});

export const cardBrandSchema = z.enum([
	"visa",
	"mastercard",
	"verve",
	"card",
]);

export const savedCardSchema = z.object({
	id: z.string().min(1),
	brand: cardBrandSchema,
	last4: z.string().length(4),
	expiry: z.string().regex(/^\d{2}\/\d{2}$/),
	isDefault: z.boolean(),
});

export type NotificationKey = z.infer<typeof notificationKeySchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AddressEntry = z.infer<typeof addressEntrySchema>;
export type CardBrand = z.infer<typeof cardBrandSchema>;
export type SavedCard = z.infer<typeof savedCardSchema>;
