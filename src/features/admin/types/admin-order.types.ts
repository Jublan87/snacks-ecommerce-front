/**
 * Admin-specific types for order management.
 * Extends the public order types with admin filter options
 * supported by GET /api/admin/orders.
 */

import type { OrderStatus, PaymentMethod } from '@features/order/types';

/** Sort options supported by the admin orders endpoint. */
export type AdminOrderSort =
  | 'newest'
  | 'oldest'
  | 'total-asc'
  | 'total-desc';

/**
 * Filters for GET /admin/orders.
 * All fields are optional — omit to get all orders.
 */
export interface AdminOrderFilters {
  status?: OrderStatus;
  userId?: string;
  /** Searches by order number or customer email */
  search?: string;
  /** ISO date string, e.g. "2024-01-01" */
  dateFrom?: string;
  /** ISO date string, e.g. "2024-12-31" */
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
  paymentMethod?: PaymentMethod;
  sort?: AdminOrderSort;
  page?: number;
  /** Max 50 per backend constraint */
  limit?: number;
}
