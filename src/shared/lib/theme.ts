import { z } from "zod";

export const themeSchema = z.enum(["light", "dark", "system"]);

export const THEME_STORAGE_KEY = "technest-theme";

export type Theme = z.infer<typeof themeSchema>;
