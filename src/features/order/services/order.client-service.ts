/**
 * Order service — client-side only (Client Components / Zustand stores).
 *
 * Uses clientFetch (BFF proxy) so the Next.js server reads the HttpOnly
 * cookie and forwards it as an Authorization header to the backend.
 * This avoids cross-origin cookie issues (sameSite: 'strict') between
 * the Vercel frontend and the Render backend.
 *
 * For Server Components and Server Actions, use order.service.ts instead.
 */

import { clientFetch } from '@shared/api';
import type { Order, PaginatedOrders, OrderFilters } from '@features/order/types';

const BASE = '/orders';

/**
 * Fetches the paginated list of orders for the authenticated user.
 * Returns null when the user is not authenticated (401).
 */
export async function getOrdersClient(filters?: OrderFilters): Promise<PaginatedOrders | null> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.page)   params.set('page', String(filters.page));
  if (filters?.limit)  params.set('limit', String(filters.limit));
  if (filters?.sort)   params.set('sort', filters.sort);

  const query = params.toString() ? `?${params.toString()}` : '';

  try {
    return await clientFetch.get<PaginatedOrders>(`${BASE}${query}`);
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
export async function getOrderByNumberClient(orderNumber: string): Promise<Order | null> {
  try {
    return await clientFetch.get<Order>(`${BASE}/number/${encodeURIComponent(orderNumber)}`);
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 401 || status === 403 || status === 404) return null;
    throw err;
  }
}
