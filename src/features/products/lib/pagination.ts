export const DEFAULT_PRODUCT_PAGE_SIZE = 10;
export const MAX_PRODUCT_PAGE_SIZE = 60;

export type ProductSort =
	| "featured"
	| "best-selling"
	| "price-asc"
	| "price-desc"
	| "rating";

export type ProductCursor = {
	sort: ProductSort;
	id: string;
	value: string | number;
};

export type ProductListFilters = {
	categoryId?: string;
	brandId?: string;
	inStockOnly?: boolean;
	includeInactive?: boolean;
};

export type ProductPageOptions = ProductListFilters & {
	limit?: number;
	cursor?: ProductCursor | null;
	sort?: ProductSort;
};

const PRODUCT_SORTS: ProductSort[] = [
	"featured",
	"best-selling",
	"price-asc",
	"price-desc",
	"rating",
];

export function isProductSort(value: unknown): value is ProductSort {
	return (
		typeof value === "string" && PRODUCT_SORTS.includes(value as ProductSort)
	);
}

export function normalizeProductPageSize(limit?: number): number {
	if (typeof limit !== "number" || !Number.isFinite(limit)) {
		return DEFAULT_PRODUCT_PAGE_SIZE;
	}

	return Math.min(
		MAX_PRODUCT_PAGE_SIZE,
		Math.max(1, Math.floor(limit)),
	);
}
