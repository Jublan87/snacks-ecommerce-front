'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import type { ShippingCalculationResult } from '@/features/shipping/services/shipping.service';
import type { ReactNode } from 'react';

interface CartSummaryProps {
  /**
   * Subtotal del carrito
   */
  subtotal: number;
  /**
   * Resultado del cálculo de envío
   */
  shippingCalculation: ShippingCalculationResult;
  /**
   * Variante del componente:
   * - 'card': Con Card de Shadcn/ui (para página completa)
   * - 'simple': Sin Card, solo contenido (para drawer)
   */
  variant?: 'card' | 'simple';
  /**
   * Botones de acción personalizables
   * Si no se proporcionan, se usan los botones por defecto
   */
  actions?: ReactNode;
  /**
   * Clase CSS adicional para el contenedor
   */
  className?: string;
}

/**
 * Componente reutilizable para mostrar el resumen del pedido
 *
 * Muestra subtotal, envío, total y mensaje de envío gratis.
 * Soporta dos variantes: 'card' (con Card) y 'simple' (sin Card).
 */
export default function CartSummary({
  subtotal,
  shippingCalculation,
  variant = 'card',
  actions,
  className = '',
}: CartSummaryProps) {
  const { shipping, isFreeShipping, amountNeededForFreeShipping } =
    shippingCalculation;

  // Calcular total: subtotal + envío
  const total = subtotal + shipping;

  const content = (
    <div className={variant === 'simple' ? 'space-y-3' : 'space-y-4'}>
      {/* Subtotal */}
      <div className="flex justify-between text-lg">
        <span className="font-bold text-gray-800">Subtotal</span>
        <span className="font-bold text-gray-900">${subtotal.toLocaleString('es-AR')}</span>
      </div>

      <Separator />

      {/* Envío */}
      <div className="flex justify-between text-lg">
        <span className="font-bold text-gray-800">Envío</span>
        <span className="font-bold text-gray-900">
          {shipping === 0 ? (
            <span className="text-green-600">Gratis</span>
          ) : (
            `$${shipping.toLocaleString('es-AR')}`
          )}
        </span>
      </div>

      {/* Mensaje motivacional si falta para envío gratis */}
      {!isFreeShipping && amountNeededForFreeShipping > 0 && (
        <p
          className={`text-base font-medium text-blue-400 ${
            variant === 'card' ? 'bg-blue-50 p-2 rounded border border-blue-400' : ''
          }`}
        >
          Agrega ${amountNeededForFreeShipping.toLocaleString('es-AR')} más para
          envío gratis
        </p>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-2xl font-bold">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">${total.toLocaleString('es-AR')}</span>
      </div>

      {/* Acciones personalizadas o por defecto */}
      {actions || (
        <>
          {/* Botón Ir a Checkout */}
          <Link href="/checkout" className="block">
            <Button className="w-full bg-[#FF5454] hover:bg-[#E63939] text-base font-bold">
              Ir a Checkout
            </Button>
          </Link>

          {/* Botón seguir comprando */}
          <Link href="/productos" className="block">
            <Button variant="outline" className="w-full text-base font-bold">
              Seguir Comprando
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  // Renderizar según la variante
  if (variant === 'card') {
    return (
      <Card className={`sticky top-8 ${className}`}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    );
  }

  return (
    <div className={`px-6 py-4 border-t bg-gray-50 ${className}`}>
      {content}
    </div>
  );
}

