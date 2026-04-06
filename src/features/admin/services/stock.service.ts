/**
 * Stock service — client-side calls (Client Components / Zustand store).
 *
 * Usa adminFetch que enruta a través del BFF Route Handler (same-origin),
 * el cual reenvía la petición al backend con la cookie HttpOnly de admin.
 *
 * Endpoints:
 *  GET  /api/admin/stock/history          — historial paginado (con filtros opcionales)
 *  GET  /api/admin/stock/history/:id      — historial de un producto específico
 *  PUT  /api/admin/products/:id/stock     — actualizar stock (en el controller de productos)
 */

import { adminFetch } from '@shared/api';
import type {
  StockHistoryFilters,
  PaginatedStockHistory,
  StockHistoryEntry,
} from '@features/admin/types/stock.types';

/** Trae el historial completo paginado, con filtros opcionales. */
export async function getStockHistory(
  filters?: StockHistoryFilters
): Promise<PaginatedStockHistory> {
  const params = new URLSearchParams();

  if (filters?.productId) params.set('productId', filters.productId);
  if (filters?.dateFrom)  params.set('dateFrom', filters.dateFrom);
  if (filters?.dateTo)    params.set('dateTo', filters.dateTo);
  if (filters?.sort)      params.set('sort', filters.sort);
  if (filters?.page)      params.set('page', String(filters.page));
  if (filters?.limit)     params.set('limit', String(filters.limit));

  const query = params.toString() ? `?${params.toString()}` : '';

  return adminFetch.get<PaginatedStockHistory>(`/api/admin/stock/history${query}`);
}

/** Trae el historial de stock de un producto específico (paginado). */
export async function getProductStockHistory(
  productId: string,
  filters?: StockHistoryFilters
): Promise<PaginatedStockHistory> {
  const params = new URLSearchParams();

  if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
  if (filters?.dateTo)   params.set('dateTo', filters.dateTo);
  if (filters?.sort)     params.set('sort', filters.sort);
  if (filters?.page)     params.set('page', String(filters.page));
  if (filters?.limit)    params.set('limit', String(filters.limit));

  const query = params.toString() ? `?${params.toString()}` : '';

  return adminFetch.get<PaginatedStockHistory>(
    `/api/admin/stock/history/${encodeURIComponent(productId)}${query}`
  );
}

/**
 * Actualiza el stock de un producto.
 * El endpoint está en el controller de productos, no en el de stock.
 */
export async function updateStock(
  productId: string,
  newStock: number,
  reason?: string
): Promise<void> {
  await adminFetch.put(`/api/admin/products/${encodeURIComponent(productId)}/stock`, {
    newStock,
    ...(reason ? { reason } : {}),
  });
}
