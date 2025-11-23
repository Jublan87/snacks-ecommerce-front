'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import type { CartItem as CartItemType } from '@/features/cart/types';

interface CartItemProps {
  item: CartItemType;
  /**
   * Variante del componente:
   * - 'card': Estilo de card con padding (para página completa)
   * - 'compact': Estilo compacto con border (para drawer)
   */
  variant?: 'card' | 'compact';
  /**
   * Función llamada al cambiar la cantidad
   */
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  /**
   * Función llamada al eliminar el item
   */
  onRemove: (itemId: string) => void;
  /**
   * Función opcional llamada al hacer clic en el item (para cerrar drawer, etc.)
   */
  onItemClick?: () => void;
}

/**
 * Componente reutilizable para mostrar un item del carrito
 * 
 * Soporta dos variantes:
 * - 'card': Para página completa del carrito (con Card de Shadcn/ui)
 * - 'compact': Para drawer del carrito (con border simple)
 */
export default function CartItem({
  item,
  variant = 'card',
  onQuantityChange,
  onRemove,
  onItemClick,
}: CartItemProps) {
  const currentPrice = item.product.discountPrice || item.product.price;
  const itemTotal = currentPrice * item.quantity;

  // Estilos según la variante
  const containerStyles =
    variant === 'card'
      ? 'flex gap-4' // Card tiene su propio padding
      : 'flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow';

  const imageSize =
    variant === 'card'
      ? 'w-24 h-24 md:w-32 md:h-32' // Más grande en página
      : 'w-20 h-20'; // Más pequeño en drawer

  const imageSizes =
    variant === 'card'
      ? '(max-width: 768px) 96px, 128px'
      : '80px';

  const titleStyles =
    variant === 'card'
      ? 'font-bold text-xl text-gray-900 hover:text-[#FF5454] transition-colors mb-2'
      : 'font-bold text-lg text-gray-900 truncate hover:text-[#FF5454] transition-colors';

  const buttonSize = variant === 'card' ? 'h-9 w-9' : 'h-8 w-8';
  const quantityTextSize = variant === 'card' ? 'text-lg' : '';

  const content = (
    <>
      {/* Imagen del producto */}
      <Link
        href={`/productos/${item.product.slug}`}
        onClick={onItemClick}
        className="flex-shrink-0"
      >
        <div
          className={`relative ${imageSize} rounded-lg overflow-hidden bg-gray-100`}
        >
          <Image
            src={item.product.images[0]?.url || '/placeholder.png'}
            alt={item.product.images[0]?.alt || item.product.name}
            fill
            className="object-cover"
            sizes={imageSizes}
          />
        </div>
      </Link>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/productos/${item.product.slug}`}
          onClick={onItemClick}
          className={variant === 'card' ? 'block' : 'block'}
        >
          <h3 className={titleStyles}>{item.product.name}</h3>
        </Link>
        <p className="text-base font-semibold text-gray-800 mb-1">
          ${currentPrice.toLocaleString('es-AR')} c/u
        </p>
        {item.product.discountPrice && (
          <p className="text-sm font-semibold text-gray-500 line-through">
            ${item.product.price.toLocaleString('es-AR')}
          </p>
        )}

        {/* Controles de cantidad */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className={buttonSize}
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Reducir cantidad de ${item.product.name}`}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </Button>
            <span
              className={`w-10 text-center font-bold ${quantityTextSize || 'text-lg'}`}
              aria-label={`Cantidad: ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className={buttonSize}
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              aria-label={`Aumentar cantidad de ${item.product.name}`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Total del item y botón eliminar */}
          <div className="flex items-center gap-4">
            <span
              className={`font-bold text-gray-900 ${
                variant === 'card' ? 'text-2xl' : 'text-xl'
              }`}
            >
              ${itemTotal.toLocaleString('es-AR')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} text-red-600 hover:text-red-700 hover:bg-red-50`}
              onClick={() => onRemove(item.id)}
              aria-label={`Eliminar ${item.product.name} del carrito`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  // Renderizar según la variante
  if (variant === 'card') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className={containerStyles}>{content}</div>
        </CardContent>
      </Card>
    );
  }

  return <div className={containerStyles}>{content}</div>;
}

