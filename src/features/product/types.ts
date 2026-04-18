export interface ProductImage {
  id: string;
  url: string;
  storageKey?: string | null;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface VariantOption {
  id: string;
  value: string;
  priceModifier: number | null;
  stock: number;
  sku: string | null;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

/**
 * Dimensiones físicas del producto en centímetros.
 * Corresponde al campo Json? `dimensions` en Prisma.
 */
export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  sku: string;
  salePrice: number;
  discountPrice: number | null;
  discountPercentage: number | null;
  stock: number;
  categoryId: string;
  category: ProductCategory;
  specifications: unknown;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  weight: number | null;
  dimensions: ProductDimensions | null;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Extiende Product con campos solo visibles en el admin.
 * NUNCA exponer costPrice en componentes públicos.
 */
export interface AdminProduct extends Product {
  costPrice: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  salePrice: number;
  discountPrice: number | null;
  discountPercentage: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  categoryId: string;
  category: ProductCategory;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  image: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children: Category[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  items: ProductListItem[];
  meta: PaginationMeta;
}

export type ProductSortBy =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'oldest';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  hasDiscount?: boolean;
  sortBy?: ProductSortBy;
  page?: number;
  limit?: number;
}

