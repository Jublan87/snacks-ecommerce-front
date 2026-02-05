'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle2,
  Circle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useOrderStore } from '@features/order/store/order-store';
import { OrderStatus } from '@features/order/types';
import {
  getStatusBadge,
  getPaymentMethodText,
  ORDER_STATUS_CONFIG,
} from '@features/order/utils/order.utils';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import { formatDate } from '@shared/utils/date.utils';

const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];
const CANCELLED: OrderStatus = 'cancelled';

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const order = useOrderStore((state) =>
    orderId ? state.orders.find((o) => o.id === orderId) ?? null : null
  );
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error('ID de pedido no válido');
      router.push('/admin/pedidos');
      return;
    }
    if (!order) {
      toast.error('Pedido no encontrado');
      router.push('/admin/pedidos');
      return;
    }
  }, [orderId, order, router]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      updateOrderStatus(order.id, newStatus);
      toast.success('Estado actualizado correctamente');
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : 'Error al actualizar el estado'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return null;
  }

  const isCancelled = order.status === CANCELLED;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/admin/pedidos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a pedidos
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalle del Pedido
            </h1>
            <p className="text-gray-600 mt-2">
              Número de orden:{' '}
              <span className="font-semibold">{order.orderNumber}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <Select
              value={order.status}
              onValueChange={(value) => handleStatusChange(value as OrderStatus)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cambiar estado" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FLOW.map((status) => (
                  <SelectItem key={status} value={status}>
                    {ORDER_STATUS_CONFIG[status].label}
                  </SelectItem>
                ))}
                <SelectItem value={CANCELLED}>
                  {ORDER_STATUS_CONFIG[CANCELLED].label}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-span-3 lg:grid-cols-3 gap-6">
        {/* Columna principal: items + dirección */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt || item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        $
                        {item.subtotal.toLocaleString('es-AR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <CardTitle>Dirección de Envío</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-gray-700">
                <p className="font-semibold">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.email}</p>
                {order.shippingAddress.phone && (
                  <p>Teléfono: {order.shippingAddress.phone}</p>
                )}
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province}
                </p>
                <p>Código Postal: {order.shippingAddress.postalCode}</p>
                {order.shippingAddress.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notas: {order.shippingAddress.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha: resumen + timeline */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha del pedido</p>
                <p className="font-semibold">
                  {formatDate(order.createdAt, true)}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Método de pago</p>
                </div>
                <p className="font-semibold">
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    $
                    {order.subtotal.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">
                    $
                    {order.shipping.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-brand">
                    $
                    {order.total.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline de estados */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {/* Creación */}
                <div className="relative flex gap-4 pb-4">
                  <div className="absolute left-[11px] top-3 z-0 h-10 w-0.5 bg-gray-200" />
                  <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pedido creado</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt, true)}
                    </p>
                  </div>
                </div>
                {/* Estados del flujo */}
                {STATUS_FLOW.map((status, index) => {
                  const currentFlowIndex = STATUS_FLOW.indexOf(order.status);
                  const isReached =
                    order.status === status ||
                    (!isCancelled && currentFlowIndex >= index) ||
                    (isCancelled && index === 0);
                  const isCurrent = order.status === status && !isCancelled;
                  const isLastStep = !isCancelled && order.status === status;
                  const showLineBelow = isCancelled || !isLastStep;
                  return (
                    <div
                      key={status}
                      className="relative flex gap-4 pb-4 last:pb-0"
                    >
                      {showLineBelow && (
                        <div className="absolute left-[11px] top-3 z-0 h-10 w-0.5 bg-gray-200" />
                      )}
                      <div
                        className={`relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                          isReached ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {isReached ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <p
                          className={
                            isCurrent ? 'font-bold text-gray-900' : 'font-medium text-gray-900'
                          }
                        >
                          {ORDER_STATUS_CONFIG[status].label}
                        </p>
                        {isCurrent && order.updatedAt !== order.createdAt && (
                          <p className="text-sm text-gray-500">
                            Actualizado:{' '}
                            {formatDate(order.updatedAt, true)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Cancelado (si aplica): único con cruz roja, sin línea después */}
                {isCancelled && (
                  <div className="relative flex gap-4">
                    <div className="relative z-10 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-medium text-red-600">Cancelado</p>
                      {order.updatedAt !== order.createdAt && (
                        <p className="text-sm text-gray-500">
                          {formatDate(order.updatedAt, true)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
