'use client'; // Componente del cliente (necesita interactividad con Zustand)

import { useCartStore } from '@/features/cart/store/cart-store';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCartCalculations } from '@/features/cart/hooks/useCartCalculations';
import { useCartActions } from '@/features/cart/hooks/useCartActions';
import CartItem from '@/features/cart/components/CartItem';
import CartSummary from '@/features/cart/components/CartSummary';
import CartEmptyState from '@/features/cart/components/CartEmptyState';

export default function CarritoPage() {
  // Obtener items del carrito
  const items = useCartStore((state) => state.items);

  // Calcular totales usando hook reutilizable
  const { subtotal, shippingCalculation, total } = useCartCalculations();

  // Obtener acciones usando hook reutilizable (con toasts para página)
  const { handleQuantityChange, handleRemoveItem } = useCartActions({
    showToasts: true,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la página */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/productos">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Carrito de Compras
              </h1>
              <p className="text-gray-800 mt-2 text-lg font-semibold">
                Revisa tus productos antes de comprar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del carrito */}
      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          // Empty state: carrito vacío usando componente reutilizable
          <CartEmptyState variant="page" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de items del carrito usando componente reutilizable */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  variant="card"
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>

            {/* Resumen del pedido usando componente reutilizable */}
            <div className="lg:col-span-1">
              <CartSummary
                subtotal={subtotal}
                shippingCalculation={shippingCalculation}
                variant="card"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
