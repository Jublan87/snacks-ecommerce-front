import { useState } from 'react';
import { useCartStore } from '@features/cart/store/cart-store';
import { ProductListItem } from '@features/product/types';
import { toast } from 'sonner';

interface UseAddToCartOptions {
  product: ProductListItem;
  quantity?: number; // Cantidad opcional, por defecto 1
  onSuccess?: () => void; // Callback opcional después de agregar exitosamente
}

/**
 * Hook personalizado para agregar productos al carrito.
 * Maneja validación local de stock, estados de carga y notificaciones.
 * La validación final de stock la hace el backend.
 */
export function useAddToCart({
  product,
  quantity = 1,
  onSuccess,
}: UseAddToCartOptions) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const getItemByProductId = useCartStore((state) => state.getItemByProductId);

  const isOutOfStock = product.stock === 0;

  /**
   * Función para agregar el producto al carrito.
   * @param customQuantity - Cantidad personalizada (opcional, sobrescribe la del hook)
   */
  const handleAddToCart = async (customQuantity?: number) => {
    const finalQuantity = customQuantity ?? quantity;

    // Validaciones: no hacer nada si no hay stock o ya está agregando
    if (isOutOfStock || isAdding) return;

    try {
      setIsAdding(true);

      // Validación local de stock para dar feedback inmediato antes de llamar al API.
      // El backend también valida, pero esto evita un round-trip innecesario.
      const existingItem = getItemByProductId(product.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalQuantity = currentQuantity + finalQuantity;

      if (product.stock < totalQuantity) {
        toast.error(
          `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`
        );
        return;
      }

      // Llamar al store que hace la petición al backend con productId + quantity
      await addItem(product.id, finalQuantity);

      // Mostrar notificación de éxito
      const message =
        finalQuantity === 1
          ? `${product.name} agregado al carrito`
          : `${finalQuantity} unidades de ${product.name} agregadas al carrito`;

      toast.success(message, {
        duration: 3000,
      });

      // Ejecutar callback de éxito si existe
      onSuccess?.();
    } catch (error) {
      // El backend puede rechazar por stock insuficiente u otros motivos
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al agregar el producto al carrito');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return {
    handleAddToCart,
    isAdding,
    isOutOfStock,
  };
}
