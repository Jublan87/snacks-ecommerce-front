/**
 * Stock store — caché cliente respaldado por la API.
 *
 * Ya NO usa localStorage. Todas las lecturas y escrituras
 * pasan por los endpoints del backend:
 *
 *  GET  /api/admin/stock/history          → fetchHistory()
 *  GET  /api/admin/stock/history/:id      → fetchProductHistory()
 *  PUT  /api/admin/products/:id/stock     → updateProductStock()
 *
 * El umbral de stock bajo (lowStockThreshold) se mantiene solo en
 * memoria de cliente porque es una preferencia de UI, no un dato del backend.
 */

import { create } from 'zustand';
import type { StockHistoryEntry, StockHistoryFilters } from '@features/admin/types/stock.types';

export const LOW_STOCK_THRESHOLD_DEFAULT = 10;

// Re-exportamos el tipo para que los componentes puedan importarlo desde aquí
export type { StockHistoryEntry };

interface StockStore {
  // ── Estado ──────────────────────────────────────────────────────────────────
  history: StockHistoryEntry[];
  /** Historial del producto abierto en el dialog (null = sin dialog) */
  productHistory: StockHistoryEntry[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  lowStockThreshold: number;

  // ── Acciones ────────────────────────────────────────────────────────────────

  /**
   * Carga (o recarga) el historial general desde la API.
   * Llamar al montar el componente o al cambiar los filtros.
   */
  fetchHistory: (filters?: StockHistoryFilters) => Promise<void>;

  /**
   * Carga el historial de un producto puntual.
   * Guarda el resultado en productHistory para usarlo en el dialog.
   */
  fetchProductHistory: (productId: string) => Promise<void>;

  /**
   * Actualiza el stock de un producto vía API y refresca el historial global.
   * Lanza un error si la operación falla (el componente lo captura con try/catch).
   */
  updateProductStock: (
    productId: string,
    newStock: number,
    reason?: string
  ) => Promise<void>;

  /** Cambia el umbral de stock bajo (preferencia de UI, solo en memoria). */
  setLowStockThreshold: (value: number) => void;

  /** Limpia el historial de producto del dialog. */
  clearProductHistory: () => void;

  /** Limpia todo el estado (ej. al cerrar sesión). */
  reset: () => void;
}

export const useStockStore = create<StockStore>()((set, get) => ({
  history: [],
  productHistory: [],
  isLoading: false,
  isUpdating: false,
  error: null,
  lowStockThreshold: LOW_STOCK_THRESHOLD_DEFAULT,

  fetchHistory: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      // Import dinámico para mantener el módulo fuera del bundle servidor
      const { getStockHistory } = await import(
        '@features/admin/services/stock.service'
      );
      const result = await getStockHistory(filters);
      // Backend returns { items, meta } — use items
      set({ history: result.items, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el historial de stock.';
      set({ error: message, isLoading: false });
    }
  },

  fetchProductHistory: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const { getProductStockHistory } = await import(
        '@features/admin/services/stock.service'
      );
      // getProductStockHistory returns PaginatedStockHistory — extract items
      const result = await getProductStockHistory(productId);
      set({ productHistory: result.items, isLoading: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar el historial del producto.';
      set({ error: message, isLoading: false, productHistory: [] });
    }
  },

  updateProductStock: async (productId, newStock, reason) => {
    set({ isUpdating: true, error: null });
    try {
      const { updateStock } = await import(
        '@features/admin/services/stock.service'
      );
      await updateStock(productId, newStock, reason);
      // Actualizar el stock localmente en el product-store para que la tabla
      // refleje el nuevo valor sin necesitar un full page refresh
      const { useProductStore } = await import(
        '@features/admin/store/product-store'
      );
      useProductStore.getState().updateStock(productId, newStock);
      // Refrescar historial global después de actualizar
      await get().fetchHistory();
      set({ isUpdating: false });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al actualizar el stock.';
      set({ error: message, isUpdating: false });
      // Re-lanzar para que el componente pueda mostrar toast de error
      throw new Error(message);
    }
  },

  setLowStockThreshold: (value) => {
    set({ lowStockThreshold: Math.max(0, value) });
  },

  clearProductHistory: () => set({ productHistory: [] }),

  reset: () =>
    set({
      history: [],
      productHistory: [],
      isLoading: false,
      isUpdating: false,
      error: null,
    }),
}));
