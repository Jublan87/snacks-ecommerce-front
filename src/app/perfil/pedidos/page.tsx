'use client';

import { useMemo } from 'react';
import { Package } from 'lucide-react';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useOrderStore } from '@/features/order/store/order-store';
import { Card, CardContent } from '@/shared/ui/card';
import OrderList from '@/features/order/components/OrderList';

function OrdersPageContent() {
  const user = useAuthStore((state) => state.user);
  const getOrdersByUserId = useOrderStore(
    (state) => state.getOrdersByUserId
  );

  // Obtener pedidos del usuario
  const orders = useMemo(() => {
    if (!user) return [];
    return getOrdersByUserId(user.id);
  }, [user, getOrdersByUserId]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-[#FF5454]" />
          <h1 className="text-3xl font-bold text-gray-900">
            Mis Pedidos
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Consulta el historial y estado de tus pedidos
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <OrderList orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}

