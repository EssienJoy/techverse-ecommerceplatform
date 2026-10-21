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
