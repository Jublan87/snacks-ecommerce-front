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
 */

import { create } from 'zustand';
import type { Order, OrderFilters, OrderStatus, PaginatedOrders } from '@features/order/types';

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

  /** @deprecated Use loadOrders() — kept temporarily to avoid breaking admin page */
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

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
      // Dynamic import keeps server-only modules out of the client bundle
      const { getOrders } = await import('@features/order/services/order.service');
      const result = await getOrders(filters);

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
      const { getOrderByNumber } = await import('@features/order/services/order.service');
      const order = await getOrderByNumber(orderNumber);

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

  // ── Deprecated: local-only status update (admin page) ──────
  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    const current = get().orders;
    const exists = current.some((o) => o.id === orderId);
    if (!exists) throw new Error('Pedido no encontrado');

    set({
      orders: current.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      ),
    });
  },

  reset: () => set({ orders: [], pagination: null, isLoading: false, error: null }),
}));

