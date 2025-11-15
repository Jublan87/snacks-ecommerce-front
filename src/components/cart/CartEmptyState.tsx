'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface CartEmptyStateProps {
  /**
   * Variante del componente:
   * - 'page': Para página completa (con Card de Shadcn/ui)
   * - 'drawer': Para drawer (sin Card, más compacto)
   */
  variant?: 'page' | 'drawer';
  /**
   * Función opcional llamada al hacer clic en el botón de acción
   */
  onActionClick?: () => void;
}

/**
 * Componente reutilizable para mostrar el estado vacío del carrito
 *
 * Soporta dos variantes:
 * - 'page': Para página completa del carrito
 * - 'drawer': Para drawer del carrito
 */
export default function CartEmptyState({
  variant = 'page',
  onActionClick,
}: CartEmptyStateProps) {
  const iconSize = variant === 'page' ? 'h-24 w-24' : 'h-16 w-16';
  const titleSize = variant === 'page' ? 'text-2xl' : 'text-lg';
  const padding = variant === 'page' ? 'p-12' : 'py-12';

  const content = (
    <div
      className={`flex flex-col items-center justify-center text-center ${padding}`}
    >
      <ShoppingCart className={`${iconSize} text-gray-300 mb-4`} />
      <h3 className={`${titleSize} font-semibold text-gray-900 mb-2`}>
        Tu carrito está vacío
      </h3>
      <p className="text-gray-600 mb-8">
        {variant === 'page'
          ? 'Agrega productos desde la página de productos'
          : 'Agrega productos para comenzar tu compra'}
      </p>
      <Link href="/productos" onClick={onActionClick}>
        <Button className="bg-[#FF5454] hover:bg-[#E63939]">
          {variant === 'page' ? 'Ver Productos' : 'Explorar Productos'}
        </Button>
      </Link>
    </div>
  );

  // Renderizar según la variante
  if (variant === 'page') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent>
          <CardTitle className="sr-only">Carrito vacío</CardTitle>
          {content}
        </CardContent>
      </Card>
    );
  }

  return <div>{content}</div>;
}
