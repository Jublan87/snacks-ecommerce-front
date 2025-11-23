'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package } from 'lucide-react';
import { Order } from '@/features/order/types';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { formatDateShort } from '@/shared/utils/date.utils';
import { ORDER_STATUS_CONFIG } from '@/features/order/utils/order.utils';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const firstItem = order.items[0];
  const itemCount = order.items.length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Imagen del primer producto */}
          <div className="flex-shrink-0">
            {firstItem?.product.images?.[0] ? (
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={firstItem.product.images[0].url}
                  alt={firstItem.product.images[0].alt || firstItem.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 96px, 128px"
                />
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Información del pedido */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {order.orderNumber}
                  </h3>
                  <Badge variant={statusConfig.variant} className="text-xs">
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDateShort(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Items del pedido */}
            <div className="mb-3">
              <p className="text-sm text-gray-700">
                {itemCount === 1
                  ? '1 producto'
                  : `${itemCount} productos`}
              </p>
              {itemCount <= 2 ? (
                <p className="text-sm text-gray-600 mt-1">
                  {order.items
                    .map((item) => `${item.quantity}x ${item.product.name}`)
                    .join(', ')}
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-1">
                  {order.items
                    .slice(0, 2)
                    .map((item) => `${item.quantity}x ${item.product.name}`)
                    .join(', ')}
                  {' y '}
                  {itemCount - 2} más
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">
                ${order.total.toLocaleString('es-AR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <Link href={`/perfil/pedidos/${order.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver detalle
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

