export type FlashSaleItemData = {
	id: string;
	productId: string;
	discount: number;
	productName: string;
	productPrice: number;
};

export type FlashSaleData = {
	id: string;
	headline: string;
	endsAt: string;
	isActive: boolean;
	items: FlashSaleItemData[];
} | null;
