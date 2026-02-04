'use client';

import { useMemo } from 'react';
import { OrderStatus } from '@/features/order/types';
import { useOrderStore } from '@/features/order/store/order-store';
import OrderTable from '@/features/admin/components/OrderTable';
import { toast } from 'sonner';

export default function AdminPedidosPage() {
  const storeOrders = useOrderStore((state) => state.orders);
  const orders = useMemo(
    () =>
      [...storeOrders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [storeOrders]
  );
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    try {
      updateOrderStatus(orderId, status);
      toast.success('Estado del pedido actualizado');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al actualizar');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-1">
          Administra los pedidos de los clientes
        </p>
      </div>
      <OrderTable orders={orders} onStatusChange={handleStatusChange} />
    </div>
  );
}

