export const LOW_STOCK_LIMIT = 15;

export function isLowStock(stock: number): boolean {
	return stock > 0 && stock <= LOW_STOCK_LIMIT;
}

export function getLowestStockVariation<T extends { stock: number }>(
	variations: T[],
): T | undefined {
	return variations
		.filter((variation) => isLowStock(variation.stock))
		.sort((a, b) => a.stock - b.stock)[0];
}
