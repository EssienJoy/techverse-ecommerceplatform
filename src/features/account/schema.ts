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

export type NotificationKey = z.infer<typeof notificationKeySchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type Settings = z.infer<typeof settingsSchema>;
