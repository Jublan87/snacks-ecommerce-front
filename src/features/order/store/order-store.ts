/**
 * Order store — client-side cache for fetched orders.
 *
 * Orders are no longer persisted in localStorage. Instead:
 *  - Reading orders: Server Components call order.service.ts directly,
 *    or Client Components call loadOrders() / loadOrderByNumber().
 *  - Creating orders: use createOrderAction (Server Action) from order.actions.ts,
 *    then call upsertOrder() to put the result in the local cache.
 *
 * This keeps the store thin: just a cache + loading state, no business logic.
 *
 * NOTE: imports order.client-service (uses apiClient / credentials:include) — NOT
 * order.service.ts (uses serverGet / next/headers, server-only).
 */

import { create } from 'zustand';
import type { Order, OrderFilters, PaginatedOrders } from '@features/order/types';
// Client-side order fetchers — safe to import in Zustand stores and Client Components
import {
  getOrdersClient,
  getOrderByNumberClient,
} from '@features/order/services/order.client-service';

interface OrderStore {
  // ── State ──────────────────────────────────────────────────
  orders: Order[];
  pagination: PaginatedOrders['pagination'] | null;
  isLoading: boolean;
  error: string | null;

  // ── Actions ────────────────────────────────────────────────

  /**
   * Load / refresh the order list for the current user via the API.
   * Only call from Client Components; Server Components should use
   * getOrders() from order.service.ts directly.
   */
  loadOrders: (filters?: OrderFilters) => Promise<void>;

  /**
   * Fetch a single order by order number and store it in the cache.
   * Useful on the confirmation page right after checkout.
   */
  loadOrderByNumber: (orderNumber: string) => Promise<Order | null>;

  /** Synchronous lookup in the local cache by UUID. */
  getOrderById: (id: string) => Order | undefined;

  /** Synchronous lookup in the local cache by order number. */
  getOrderByOrderNumber: (orderNumber: string) => Order | undefined;

  /**
   * Add or update an order in the local cache.
   * Call this after createOrderAction() returns to make the order
   * available immediately to other Client Components.
   */
  upsertOrder: (order: Order) => void;

  /** Clear all loaded state (e.g. on logout). */
  reset: () => void;
}

export const useOrderStore = create<OrderStore>()((set, get) => ({
  orders: [],
  pagination: null,
  isLoading: false,
  error: null,

  loadOrders: async (filters?: OrderFilters) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getOrdersClient(filters);

      if (!result) {
        // null → unauthenticated; clear without error
        set({ orders: [], pagination: null, isLoading: false });
        return;
      }

      set({
        orders: result.orders,
        pagination: result.pagination,
        isLoading: false,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los pedidos.';
      set({ error: message, isLoading: false });
    }
  },

  loadOrderByNumber: async (orderNumber: string) => {
    try {
      const order = await getOrderByNumberClient(orderNumber);

      if (order) {
        get().upsertOrder(order);
      }

      return order;
    } catch {
      return null;
    }
  },

  getOrderById: (id: string) => get().orders.find((o) => o.id === id),

  getOrderByOrderNumber: (orderNumber: string) =>
    get().orders.find((o) => o.orderNumber === orderNumber),

  upsertOrder: (order: Order) => {
    const current = get().orders;
    const idx = current.findIndex((o) => o.id === order.id);

    if (idx === -1) {
      // Prepend so newest order appears first
      set({ orders: [order, ...current] });
    } else {
      const updated = [...current];
      updated[idx] = order;
      set({ orders: updated });
    }
  },

  reset: () => set({ orders: [], pagination: null, isLoading: false, error: null }),
}));

