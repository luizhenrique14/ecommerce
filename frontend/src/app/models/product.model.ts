export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  created_at?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
  stock?: number;
  created_at?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductParams {
  category?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  icon: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category_id: number;
  stock?: number;
}

export interface SortOption {
  value: string;
  label: string;
  sort: string;
  order: 'ASC' | 'DESC';
}
