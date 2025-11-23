'use client';

import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Order, OrderStatus } from '@/features/order/types';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Button } from '@/shared/ui/button';
import OrderCard from '@/features/order/components/OrderCard';
import { ORDER_STATUS_CONFIG } from '@/features/order/utils/order.utils';

interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Filtrar y buscar pedidos
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Buscar por número de pedido
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [orders, statusFilter, searchQuery]);

  const statusFilterLabel =
    statusFilter === 'all'
      ? 'Todos los estados'
      : ORDER_STATUS_CONFIG[statusFilter]?.label || 'Todos los estados';

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Buscar por número de pedido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por estado */}
        <div className="sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as OrderStatus | 'all')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={statusFilterLabel} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(ORDER_STATUS_CONFIG).map(([status, config]) => (
                <SelectItem key={status} value={status}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón para limpiar filtros */}
        {(searchQuery || statusFilter !== 'all') && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
            className="whitespace-nowrap"
          >
            <Filter className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Lista de pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {orders.length === 0
              ? 'No tienes pedidos aún'
              : 'No se encontraron pedidos con los filtros seleccionados'}
          </p>
          {orders.length === 0 && (
            <p className="text-gray-400 mt-2">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

