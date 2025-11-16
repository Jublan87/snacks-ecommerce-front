import { useMemo } from 'react';
import { useCartStore } from '@/features/cart/store/cart-store';
import { calculateShipping } from '@/features/shipping/services/shipping.service';
import type { CartItem } from '@/features/cart/types';

// Selector estable para obtener items del carrito
// Se define fuera del componente para que sea una referencia estable
// Esto evita que ESLint marque advertencias sobre dependencias que cambian en cada render
const selectItems = (state: { items: CartItem[] }) => state.items;

/**
 * Hook personalizado para calcular totales del carrito
 *
 * Centraliza toda la lógica de cálculos (subtotal, envío, total)
 * para evitar duplicación entre componentes.
 *
 * @returns Objeto con subtotal, shippingCalculation y total
 */
export function useCartCalculations() {
  // Obtener items del store usando selector estable definido fuera del componente
  const items = useCartStore(selectItems);

  // Calcular subtotal: suma de todos los items (precio * cantidad)
  // Usa discountPrice si existe, sino usa price
  const subtotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce(
      (total, item) =>
        total +
        (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );
  }, [items]);

  // Calcular envío usando el servicio parametrizable
  const shippingCalculation = useMemo(
    () => calculateShipping({ subtotal }),
    [subtotal]
  );

  // Calcular total: subtotal + envío
  const total = useMemo(
    () => subtotal + shippingCalculation.shipping,
    [subtotal, shippingCalculation.shipping]
  );

  return {
    subtotal,
    shippingCalculation,
    shipping: shippingCalculation.shipping,
    total,
  };
}

