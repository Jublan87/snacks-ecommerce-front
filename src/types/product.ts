export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  stock: number;
  images: ProductImage[];
  categoryId: string;
  category?: Category;
  variants?: ProductVariant[];
  specifications?: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  value: string;
  priceModifier?: number;
  stock: number;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  children?: Category[];
  image?: string;
  order: number;
  isActive: boolean;
}

