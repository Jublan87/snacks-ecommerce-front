/**
 * Admin order service — CLIENT-side only (Client Components).
 *
 * Calls the admin-specific endpoints (GET /admin/orders, PUT /admin/orders/:id/status).
 * Uses apiClient which sends credentials: 'include' so the HttpOnly JWT cookie
 * is forwarded automatically. Keep separate from the user-facing order service
 * (which is server-side and calls /orders without admin privileges).
 */

import { adminFetch } from '@shared/api';
import type { Order, OrderStatus } from '@features/order/types';
import type { AdminOrderFilters } from '@features/admin/types/admin-order.types';

const BASE = '/api/admin/orders';

/**
 * Admin paginated orders response.
 * Backend GET /admin/orders returns { items, meta, summary } — NOT { orders, pagination }.
 */
export interface AdminOrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
}

export interface AdminPaginatedOrders {
  items: AdminOrderDetail[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: AdminOrderSummary;
}

/**
 * Fetches all orders with optional filters.
 * The backend supports rich filtering: status, userId, search, dateFrom,
 * dateTo, minTotal, maxTotal, paymentMethod, sort, page, limit.
 */
export async function getAdminOrders(
  filters?: AdminOrderFilters
): Promise<AdminPaginatedOrders> {
  const params = new URLSearchParams();

  if (filters?.status)        params.set('status', filters.status);
  if (filters?.userId)        params.set('userId', filters.userId);
  if (filters?.search)        params.set('search', filters.search);
  if (filters?.dateFrom)      params.set('dateFrom', filters.dateFrom);
  if (filters?.dateTo)        params.set('dateTo', filters.dateTo);
  if (filters?.minTotal != null) params.set('minTotal', String(filters.minTotal));
  if (filters?.maxTotal != null) params.set('maxTotal', String(filters.maxTotal));
  if (filters?.paymentMethod) params.set('paymentMethod', filters.paymentMethod);
  if (filters?.sort)          params.set('sort', filters.sort);
  if (filters?.page)          params.set('page', String(filters.page));
  if (filters?.limit)         params.set('limit', String(filters.limit));

  const query = params.toString() ? `?${params.toString()}` : '';
  return adminFetch.get<AdminPaginatedOrders>(`${BASE}${query}`);
}

// ─── Admin order detail types (backend shape) ────────────────────────────────

export interface AdminOrderUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminOrderItemProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
}

export interface AdminOrderItem {
  id: string;
  product: AdminOrderItemProduct;
  quantity: number;
  price: number;
  subtotal: number;
}

/** Admin order detail — what GET /admin/orders/:id and PUT /admin/orders/:id/status return. */
export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  user: AdminOrderUser;
  items: AdminOrderItem[];
  shippingAddress: Record<string, unknown>;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches a single order by UUID from the admin endpoint.
 * Returns null when not found (404) or not authorized (403).
 */
export async function getAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  try {
    return await adminFetch.get<AdminOrderDetail>(`${BASE}/${id}`);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 403 || status === 404) return null;
    throw err;
  }
}

/**
 * Fetches a single order by human-readable order number (e.g. ORD-2024-…).
 * Returns null when not found or not authorized.
 */
export async function getAdminOrderByNumber(
  orderNumber: string
): Promise<AdminOrderDetail | null> {
  try {
    return await adminFetch.get<AdminOrderDetail>(
      `${BASE}/number/${encodeURIComponent(orderNumber)}`
    );
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 403 || status === 404) return null;
    throw err;
  }
}

/**
 * Updates an order's status via PUT /admin/orders/:id/status.
 * Returns the updated order detail as confirmed by the backend.
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<AdminOrderDetail> {
  return adminFetch.put<AdminOrderDetail>(`${BASE}/${id}/status`, { status });
}
