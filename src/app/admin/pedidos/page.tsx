'use client';

/**
 * Admin orders page — Client Component.
 *
 * Loads orders via the store (which calls the API) on mount.
 * The store's deprecated updateOrderStatus keeps local state in sync
 * for instant UI feedback while a proper PATCH endpoint is added later.
 */

import { useEffect, useMemo } from 'react';
import { OrderStatus } from '@features/order/types';
import { useOrderStore } from '@features/order/store/order-store';
import OrderTable from '@features/admin/components/OrderTable';
import { toast } from 'sonner';

export default function AdminPedidosPage() {
  const orders = useOrderStore((state) => state.orders);
  const isLoading = useOrderStore((state) => state.isLoading);
  const loadOrders = useOrderStore((state) => state.loadOrders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  // Fetch all orders on mount (no user filter — admin sees everything)
  useEffect(() => {
    loadOrders({ sort: 'newest', limit: 50 });
  }, [loadOrders]);

  // Sort by newest first for the table (already sorted by API, but keep it explicit)
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [orders]
  );

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    try {
      // Local-only update for instant feedback.
      // TODO: call a PATCH /orders/:id/status Server Action when the endpoint is ready.
      updateOrderStatus(orderId, status);
      toast.success('Estado del pedido actualizado');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar');
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
        </p>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando pedidos...</p>
      ) : (
        <OrderTable orders={sortedOrders} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}
