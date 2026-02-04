'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/features/order/types';
import {
  ORDER_STATUS_CONFIG,
  getStatusBadge,
} from '@/features/order/utils/order.utils';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Search, Eye, MoreHorizontal, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { formatDateShort } from '@/shared/utils/date.utils';
import { cn } from '@/shared/utils/utils';

type SortColumn = 'orderNumber' | 'client' | 'date' | 'total' | 'status';
type SortDir = 'asc' | 'desc';

interface OrderTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}

type DateFilterPreset = 'all' | 'today' | 'last7' | 'last30';

function getClientDisplayName(order: Order): string {
  const a = order.shippingAddress;
  return `${a.firstName} ${a.lastName}`.trim() || a.email || order.userId;
}

function filterOrdersByDate(
  orders: Order[],
  preset: DateFilterPreset
): Order[] {
  if (preset === 'all') return orders;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

  return orders.filter((o) => {
    const created = new Date(o.createdAt).getTime();
    switch (preset) {
      case 'today':
        return created >= todayStart.getTime() && created <= todayEnd.getTime();
      case 'last7':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return created >= weekAgo.getTime();
      case 'last30':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return created >= monthAgo.getTime();
      default:
        return true;
    }
  });
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterPreset>('all');
  const [sortBy, setSortBy] = useState<SortColumn | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    let result = filterOrdersByDate(orders, dateFilter);

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((order) => {
        const client = getClientDisplayName(order).toLowerCase();
        const email = order.shippingAddress.email.toLowerCase();
        const orderNum = order.orderNumber.toLowerCase();
        return (
          client.includes(q) ||
          email.includes(q) ||
          orderNum.includes(q)
        );
      });
    }

    return result;
  }, [orders, statusFilter, dateFilter, searchQuery]);

  const sortedOrders = useMemo(() => {
    if (!sortBy) return filteredOrders;
    const sorted = [...filteredOrders];
    const mult = sortDir === 'asc' ? 1 : -1;
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'orderNumber':
          return mult * a.orderNumber.localeCompare(b.orderNumber);
        case 'client':
          return mult * getClientDisplayName(a).localeCompare(getClientDisplayName(b));
        case 'date':
          return mult * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'total':
          return mult * (a.total - b.total);
        case 'status':
          return mult * ORDER_STATUS_CONFIG[a.status].label.localeCompare(ORDER_STATUS_CONFIG[b.status].label);
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredOrders, sortBy, sortDir]);

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedOrders.slice(start, start + itemsPerPage);
  }, [sortedOrders, currentPage]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
    setCurrentPage(1);
  };

  const SortHeader = ({
    column,
    label,
    className,
  }: {
    column: SortColumn;
    label: string;
    className?: string;
  }) => {
    const isActive = sortBy === column;
    return (
      <th className={cn('px-6 py-3 text-xs font-semibold text-brand uppercase tracking-wider', className)}>
        <button
          type="button"
          onClick={() => handleSort(column)}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left w-full"
        >
          <span>{label}</span>
          {isActive ? (
            sortDir === 'asc' ? (
              <ChevronUp className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            )
          ) : (
            <ChevronsUpDown className="w-4 h-4 flex-shrink-0 opacity-60" />
          )}
        </button>
      </th>
    );
  };

  const handleFilterChange = () => setCurrentPage(1);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const statusOptions: OrderStatus[] = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por cliente, email o número de orden..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {ORDER_STATUS_CONFIG[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={dateFilter}
          onValueChange={(value: DateFilterPreset) => {
            setDateFilter(value);
            handleFilterChange();
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fechas</SelectItem>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="last7">Últimos 7 días</SelectItem>
            <SelectItem value="last30">Últimos 30 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand/10 border-b-2 border-brand">
              <tr>
                <SortHeader column="orderNumber" label="Orden" />
                <SortHeader column="client" label="Cliente" />
                <SortHeader column="date" label="Fecha" />
                <SortHeader column="total" label="Total" />
                <SortHeader column="status" label="Estado" />
                <th className="px-6 py-3 text-right text-xs font-semibold text-brand uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[rgb(var(--brand)/0.03)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getClientDisplayName(order)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateShort(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/pedidos/${order.id}`}>
                          <Button variant="ghost" size="icon" title="Ver detalle">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Cambiar estado"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {statusOptions.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => onStatusChange(order.id, status)}
                                disabled={order.status === status}
                              >
                                {ORDER_STATUS_CONFIG[status].label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Mostrando {paginatedOrders.length} de {sortedOrders.length}{' '}
              pedidos
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center gap-1">
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                            ? 'bg-brand hover:bg-brand-hover text-white'
                            : ''
                        }
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
