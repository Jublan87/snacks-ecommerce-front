/**
 * Order history page — Server Component.
 *
 * Fetches the user's orders directly on the server (faster, SEO-friendly,
 * no loading spinner needed). The JWT is read from the HttpOnly cookie by
 * serverGet() automatically.
 */

import { Package } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getOrders } from '@features/order/services/order.service';
import { Card, CardContent } from '@shared/ui/card';
import OrderList from '@features/order/components/OrderList';

export default async function OrdersPage() {
  // Fetch orders server-side. Returns null when unauthenticated.
  const result = await getOrders({ sort: 'newest', limit: 50 });

  if (result === null) {
    // User has no valid session — redirect to login
    redirect('/login?redirect=/perfil/pedidos');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-8 h-8 text-brand" />
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        </div>
        <p className="text-gray-600 mt-2">
          Consulta el historial y estado de tus pedidos
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* OrderList is a Client Component (needs search/filter interactivity) */}
          <OrderList orders={result.orders} />
        </CardContent>
      </Card>
    </div>
  );
}
