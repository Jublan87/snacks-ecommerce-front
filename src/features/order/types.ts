/**
 * Tipos TypeScript para pedidos (orders).
 * Shapes match the backend interfaces in:
 *   snacks-ecommerce-back/src/modules/orders/interfaces/order.interfaces.ts
 */

// ──────────────────────────────────────────────────────────
// Enums / union types
// ──────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'cash_on_delivery'
  | 'bank_transfer';

// ──────────────────────────────────────────────────────────
// Sub-shapes returned by the backend inside an order
// ──────────────────────────────────────────────────────────

export interface OrderShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface OrderProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface OrderProductCategory {
  id: string;
  name: string;
  slug: string;
}

/** Product data embedded inside an order item (as returned by the backend). */
export interface OrderProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: OrderProductImage[];
  categoryId: string;
  category: OrderProductCategory;
}

// ──────────────────────────────────────────────────────────
// Core order types
// ──────────────────────────────────────────────────────────

/** A single line item inside an order — matches backend OrderItemDetail. */
export interface OrderItem {
  id: string;
  product: OrderProduct;
  quantity: number;
  price: number;    // price at the time of purchase
  subtotal: number; // quantity × price
}

/** Full order detail — matches backend OrderDetail. */
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: string; // kept as string to accept any PaymentMethod value from backend
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

/** Paginated list response — matches backend PaginatedOrders. */
export interface PaginatedOrders {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ──────────────────────────────────────────────────────────
// Request / filter types (frontend-side)
// ──────────────────────────────────────────────────────────

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}

/** Payload sent to POST /orders. Items only need productId + quantity. */
export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
}
