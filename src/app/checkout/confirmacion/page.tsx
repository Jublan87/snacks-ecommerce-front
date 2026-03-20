'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import { useOrderStore } from '@features/order/store/order-store';
import { useAuthStore } from '@features/auth/store/auth-store';
import type { Order } from '@features/order/types';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import { Separator } from '@shared/ui/separator';
import { Badge } from '@shared/ui/badge';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPaymentMethodText(method: string) {
  const methods: Record<string, string> = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    cash_on_delivery: 'Efectivo contra Entrega',
    bank_transfer: 'Transferencia Bancaria',
  };
  return methods[method] || method;
}

function getStatusBadge(status: string) {
  const statusConfig: Record<
    string,
    { label: string; variant: 'default' | 'secondary' | 'outline' }
  > = {
    pending: { label: 'Pendiente', variant: 'outline' },
    confirmed: { label: 'Confirmado', variant: 'default' },
    processing: { label: 'En Proceso', variant: 'default' },
    shipped: { label: 'Enviado', variant: 'secondary' },
    delivered: { label: 'Entregado', variant: 'default' },
    cancelled: { label: 'Cancelado', variant: 'outline' },
  };

  const config = statusConfig[status] ?? {
    label: status,
    variant: 'outline' as const,
  };

  return (
    <Badge variant={config.variant} className="text-sm">
      {config.label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Page content
// ─────────────────────────────────────────────────────────────

function ConfirmacionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  const getOrderByOrderNumber = useOrderStore(
    (state) => state.getOrderByOrderNumber,
  );
  const loadOrderByNumber = useOrderStore((state) => state.loadOrderByNumber);
  const user = useAuthStore((state) => state.user);

  // The order may already be in the cache (put there by checkout page after creation),
  // or we need to fetch it from the API (e.g. after a page refresh).
  const cachedOrder = orderNumber ? getOrderByOrderNumber(orderNumber) : null;
  const [order, setOrder] = useState<Order | null>(cachedOrder ?? null);
  const [isFetching, setIsFetching] = useState(!cachedOrder && !!orderNumber);

  useEffect(() => {
    if (cachedOrder) {
      setOrder(cachedOrder);
      return;
    }

    if (!orderNumber) return;

    setIsFetching(true);
    loadOrderByNumber(orderNumber)
      .then((fetched) => {
        setOrder(fetched);
        setIsFetching(false);
      })
      .catch(() => setIsFetching(false));
  }, [orderNumber, cachedOrder, loadOrderByNumber]);

  useEffect(() => {
    if (!orderNumber) {
      toast.error('Número de pedido no válido');
      router.push('/carrito');
      return;
    }

    if (!isFetching && !order) {
      toast.error('Pedido no encontrado');
      router.push('/carrito');
      return;
    }

    if (order && user && order.userId !== user.id) {
      toast.error('No tienes permiso para ver este pedido');
      router.push('/carrito');
    }
  }, [orderNumber, order, isFetching, user, router]);

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando pedido...</p>
      </div>
    );
  }

  if (!order) {
    return null; // useEffect will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/productos">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-gray-800 mt-2 text-lg font-semibold">
                Gracias por tu compra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Mensaje de éxito */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-green-900 mb-1">
                    Tu pedido ha sido confirmado
                  </h2>
                  <p className="text-green-800">
                    Recibirás un correo electrónico con los detalles de tu
                    pedido en breve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del pedido */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Detalles del Pedido
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Número de orden:{' '}
                    <span className="font-bold">{order.orderNumber}</span>
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha del pedido</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>

              <Separator />

              {/* Items del pedido */}
              <div>
                <h3 className="text-lg font-bold mb-4">Productos</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-lg bg-gray-50"
                    >
                      {/* Imagen del producto */}
                      <Link
                        href={`/productos/${item.product.slug}`}
                        className="flex-shrink-0"
                      >
                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={
                              item.product.images[0]?.url || '/placeholder.png'
                            }
                            alt={
                              item.product.images[0]?.alt || item.product.name
                            }
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 96px, 128px"
                          />
                        </div>
                      </Link>

                      {/* Información del producto */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/productos/${item.product.slug}`}
                          className="block"
                        >
                          <h4 className="font-bold text-lg text-gray-900 hover:text-brand transition-colors mb-1">
                            {item.product.name}
                          </h4>
                        </Link>
                        <p className="text-sm text-gray-600 mb-2">
                          Cantidad: {item.quantity}
                        </p>
                        <p className="text-base font-semibold text-gray-800">
                          ${item.price.toLocaleString('es-AR')} c/u
                        </p>
                      </div>

                      {/* Total del item */}
                      <div className="flex-shrink-0">
                        <p className="font-bold text-xl text-gray-900">
                          ${item.subtotal.toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Resumen de precios */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${order.subtotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-semibold">
                    ${order.shipping.toLocaleString('es-AR')}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <Separator />

              {/* Dirección de envío */}
              <div>
                <h3 className="text-lg font-bold mb-3">Dirección de Envío</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.address}
                  </p>
                  <p className="text-gray-700">
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.province}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Teléfono: {order.shippingAddress.phone}
                  </p>
                  {order.shippingAddress.notes && (
                    <p className="text-gray-600 mt-2 italic">
                      Notas: {order.shippingAddress.notes}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Método de pago */}
              <div>
                <h3 className="text-lg font-bold mb-3">Método de Pago</h3>
                <p className="text-gray-700">
                  {getPaymentMethodText(order.paymentMethod)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/productos">
                <Package className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/perfil/pedidos">Ver Mis Pedidos</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">Cargando...</div>
          </div>
        }
      >
        <ConfirmacionPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}
