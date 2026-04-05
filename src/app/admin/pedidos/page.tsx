'use client';

/**
 * Admin orders page — Client Component.
 *
 * Uses the admin-specific order service (GET /admin/orders) — NOT the user
 * order store — so it can see all orders and access admin-only filters.
 * Status changes call PUT /admin/orders/:id/status for a real backend update.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { OrderStatus } from '@features/order/types';
import {
  getAdminOrders,
  updateOrderStatus,
  type AdminOrderDetail,
  type AdminPaginatedOrders,
} from '@features/admin/services/order.service';
import OrderTable from '@features/admin/components/OrderTable';
import { toast } from 'sonner';

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<AdminOrderDetail[]>([]);
  const [pagination, setPagination] = useState<AdminPaginatedOrders['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load all orders on mount — admin sees everything, newest first
  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAdminOrders({ sort: 'newest', limit: 50 });
      // Backend returns { items, meta, summary } — NOT { orders, pagination }
      setOrders(result.items);
      setPagination(result.meta);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar los pedidos';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Sort by newest first (API already does this, but keep explicit for safety)
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    // Optimistic update — apply locally first for instant feedback
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      )
    );

    try {
      // Persist to backend and sync with the confirmed server state
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
      toast.success('Estado del pedido actualizado');
    } catch (e) {
      // Rollback optimistic update by reloading from server
      toast.error(
        e instanceof Error ? e.message : 'Error al actualizar el estado'
      );
      loadOrders();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Pedidos
        </h1>
        <p className="text-gray-600 mt-1">
          Administra los pedidos de los clientes
          {pagination && (
            <span className="ml-2 text-sm text-gray-400">
              ({pagination.total} en total)
            </span>
          )}
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : (
        // AdminOrderDetail is structurally compatible with Order for table display purposes
        <OrderTable orders={sortedOrders as unknown as import('@features/order/types').Order[]} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
