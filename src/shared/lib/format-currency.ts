import { siteConfig } from "../config";

export function formatCurrency(amount: number, currency?: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? siteConfig.currency,
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}
