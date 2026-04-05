import { serverGet } from '@shared/api/server';
import type {
  Product,
  ProductListItem,
  ProductsResponse,
  Category,
  ProductFilters,
} from '@features/product/types';

function buildQueryString(filters?: ProductFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.inStock !== undefined) params.set('inStock', String(filters.inStock));
  if (filters.isFeatured !== undefined) params.set('isFeatured', String(filters.isFeatured));
  if (filters.hasDiscount !== undefined) params.set('hasDiscount', String(filters.hasDiscount));
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const qs = buildQueryString(filters);
  return serverGet<ProductsResponse>(`/products${qs}`, {
    next: { revalidate: 60, tags: ['products'] },
  });
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return serverGet<Product>(`/products/slug/${slug}`, {
    next: { revalidate: 60, tags: ['products'] },
  });
}

export async function getProductById(id: string): Promise<Product> {
  return serverGet<Product>(`/products/${id}`, {
    next: { revalidate: 60, tags: ['products'] },
  });
}

export async function getCategories(): Promise<Category[]> {
  return serverGet<Category[]>('/categories', {
    next: { revalidate: 300, tags: ['categories'] },
  });
}

export async function getCategoryById(id: string): Promise<Category> {
  return serverGet<Category>(`/categories/${id}`, {
    next: { revalidate: 300, tags: ['categories'] },
  });
}

export type { ProductListItem };
