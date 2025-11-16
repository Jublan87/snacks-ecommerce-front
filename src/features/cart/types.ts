import { Product } from '@/features/product/types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

