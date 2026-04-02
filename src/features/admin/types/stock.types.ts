/**
 * Tipos para el módulo de stock del panel de administración.
 *
 * StockHistoryEntry refleja lo que devuelve el backend en
 * GET /api/admin/stock/history y GET /api/admin/stock/history/:productId
 */

export interface StockHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}

/** Parámetros de query para GET /api/admin/stock/history */
export interface StockHistoryFilters {
  productId?: string;
  dateFrom?: string;
  dateTo?: string;
  sort?: 'newest' | 'oldest';
  page?: number;
  limit?: number;
}

// Backend returns { items, meta } — matches PaginatedProducts pattern
export interface PaginatedStockHistory {
  items: StockHistoryEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Body para PUT /api/admin/products/:id/stock */
export interface UpdateStockBody {
  newStock: number;
  reason?: string;
}
