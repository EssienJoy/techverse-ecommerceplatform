import {
	Camera,
	Grid2X2,
	Headphones,
	Laptop,
	Smartphone,
	Watch,
} from "lucide-react";

export const categoryIcons = {
	grid: Grid2X2,
	smartphone: Smartphone,
	laptop: Laptop,
	headphones: Headphones,
	watch: Watch,
	camera: Camera,
};

export type CategoryIconKey = keyof typeof categoryIcons;

export type ContentCategory = {
	id: string;
	title: string;
	label: string;
	slug: string;
	icon: CategoryIconKey;
	imageUrl?: string;
};

export type ContentBrand = {
	id: string;
	name: string;
	logoUrl?: string;
};

export type HeroSlide = {
	id: string;
	tag: string;
	title: string;
	subtitle: string;
	imageUrl: string;
	href: string;
	active: boolean;
};

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
