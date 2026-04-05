/**
 * Order service — server-side only (Server Components / Server Actions).
 *
 * Uses serverGet which reads the JWT from the HttpOnly cookie automatically,
 * so all calls are made on behalf of the currently authenticated user.
 */

import { serverGet } from '@shared/api/server';
import type { Order, PaginatedOrders, OrderFilters } from '@features/order/types';

const BASE = '/orders';

/**
 * Fetches the paginated list of orders for the authenticated user.
 * Returns null when the user is not authenticated (401).
 */
export async function getOrders(filters?: OrderFilters): Promise<PaginatedOrders | null> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.page)   params.set('page', String(filters.page));
  if (filters?.limit)  params.set('limit', String(filters.limit));
  if (filters?.sort)   params.set('sort', filters.sort);

  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    return await serverGet<PaginatedOrders>(`${BASE}${query}`, {
      // Always fresh — order list can change between page loads
      cache: 'no-store',
    });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 401) return null; // unauthenticated
    throw err;
  }
}

/**
 * Fetches a single order by its human-readable order number (e.g. ORD-2024-…).
 * Returns null when not found or not authorized.
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    return await serverGet<Order>(`${BASE}/number/${encodeURIComponent(orderNumber)}`, {
      cache: 'no-store',
    });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) return null;
    throw err;
  }
}

/**
 * Fetches a single order by its UUID.
 * Returns null when not found or not authorized.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    return await serverGet<Order>(`${BASE}/${id}`, {
      cache: 'no-store',
    });
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) return null;
    throw err;
  }
}
