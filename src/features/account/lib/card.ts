import type { CardBrand } from "../schema";

/**
 * Identifies the card network from the leading digits. This is only used to
 * label a saved card; nothing here validates or processes a payment.
 */
export function detectCardBrand(digits: string): CardBrand {
	if (/^4/.test(digits)) return "visa";
	if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
	if (/^(506[0-1]|507|650)/.test(digits)) return "verve";
	return "card";
}

export const cardBrandLabels: Record<CardBrand, string> = {
	visa: "Visa",
	mastercard: "Mastercard",
	verve: "Verve",
	card: "Card",
};

/** Groups digits as 4-4-4-4 while the customer types. */
export function formatCardNumberInput(value: string) {
	return value
		.replace(/\D/g, "")
		.slice(0, 19)
		.replace(/(.{4})/g, "$1 ")
		.trim();
}

/** Turns "1226" into "12/26" while the customer types. */
export function formatExpiryInput(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 4);

	return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function isValidExpiry(value: string) {
	const match = /^(\d{2})\/(\d{2})$/.exec(value);
	if (!match) return false;

	const month = Number(match[1]);

	return month >= 1 && month <= 12;
}
