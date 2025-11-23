'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { useOrderStore } from '@/features/order/store/order-store';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { formatDate } from '@/shared/utils/date.utils';
import {
  getStatusBadge,
  getPaymentMethodText,
} from '@/features/order/utils/order.utils';

function OrderDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const getOrderById = useOrderStore((state) => state.getOrderById);

  // Obtener el pedido
  const order = orderId ? getOrderById(orderId) : null;

  // Validar que el pedido existe y pertenece al usuario
  useEffect(() => {
    if (!orderId) {
      toast.error('ID de pedido no válido');
      router.push('/perfil/pedidos');
      return;
    }

    if (!order) {
      toast.error('Pedido no encontrado');
      router.push('/perfil/pedidos');
      return;
    }

    if (user && order.userId !== user.id) {
      toast.error('No tienes permiso para ver este pedido');
      router.push('/perfil/pedidos');
      return;
    }
  }, [orderId, order, user, router]);

  if (!order) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/perfil/pedidos">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis pedidos
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalle del Pedido
            </h1>
            <p className="text-gray-600 mt-2">
              Número de orden: <span className="font-semibold">{order.orderNumber}</span>
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items del pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Imagen del producto */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt || item.product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${item.subtotal.toLocaleString('es-AR', {
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

          {/* Dirección de envío */}
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
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province}
                </p>
                <p>Código Postal: {order.shippingAddress.postalCode}</p>
                {order.shippingAddress.phone && (
                  <p>Teléfono: {order.shippingAddress.phone}</p>
                )}
                {order.shippingAddress.notes && (
                  <p className="text-sm text-gray-600 mt-2">
                    Notas: {order.shippingAddress.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fecha */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha del pedido</p>
                <p className="font-semibold">
                  {formatDate(order.createdAt, true)}
                </p>
              </div>

              <Separator />

              {/* Método de pago */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Método de pago</p>
                </div>
                <p className="font-semibold">
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>

              <Separator />

              {/* Resumen de precios */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${order.subtotal.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-semibold">
                    ${order.shipping.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#FF5454]">
                    ${order.total.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailPageContent />
    </ProtectedRoute>
  );
}

