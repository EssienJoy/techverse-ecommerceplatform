export interface ProductVariation {
	name: string;
	color: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  rating: number;
  reviews: number;
  features?: string[];
  variations?: ProductVariation[];
  category?: string;
}
