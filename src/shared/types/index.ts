export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
}
