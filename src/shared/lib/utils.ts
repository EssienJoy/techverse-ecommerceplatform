import { siteConfig } from "../config";

/** Reads a required environment variable, throwing when it is missing. */
export function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} is not set`);
	}
	return value;
}

export function formatCurrency(amount: number, currency?: string): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency ?? siteConfig.currency,
		currencyDisplay: "narrowSymbol",
	}).format(amount);
}
