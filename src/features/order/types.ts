/**
 * Tipos TypeScript para pedidos (orders)
 */

import { Product } from '@/features/product/types';
import { ShippingAddress, PaymentMethod } from '@/features/checkout/types';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number; // Precio al momento de la compra
  subtotal: number; // quantity * price
}

export interface Order {
  id: string;
  orderNumber: string; // Número de orden legible (ej: ORD-2024-001)
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

