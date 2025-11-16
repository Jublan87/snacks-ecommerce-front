import { useState } from 'react';
import { useCartStore } from '@/features/cart/store/cart-store';
import { Product } from '@/features/product/types';
import { toast } from 'sonner';

interface UseAddToCartOptions {
  product: Product;
  quantity?: number; // Cantidad opcional, por defecto 1
  onSuccess?: () => void; // Callback opcional después de agregar exitosamente
}

/**
 * Hook personalizado para agregar productos al carrito
 * Maneja validación de stock, estados de carga y notificaciones
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
   * Función para agregar el producto al carrito
   * @param customQuantity - Cantidad personalizada (opcional, sobrescribe la del hook)
   */
  const handleAddToCart = async (customQuantity?: number) => {
    const finalQuantity = customQuantity ?? quantity;

    // Validaciones: no hacer nada si no hay stock o ya está agregando
    if (isOutOfStock || isAdding) return;

    try {
      setIsAdding(true);

      // Validar stock: verificar si el producto ya está en el carrito
      // Si está, sumar la cantidad actual + la nueva cantidad
      const existingItem = getItemByProductId(product.id);
      const totalQuantity = existingItem
        ? existingItem.quantity + finalQuantity
        : finalQuantity;

      // Si no hay suficiente stock, mostrar error y salir
      if (product.stock < totalQuantity) {
        toast.error(
          `Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`
        );
        return;
      }

      // Agregar producto al carrito usando el store de Zustand
      addItem(product, finalQuantity);

      // Mostrar notificación de éxito
      // El mensaje cambia según si es singular o plural
      const message =
        finalQuantity === 1
          ? `${product.name} agregado al carrito`
          : `${finalQuantity} ${
              finalQuantity === 1 ? 'unidad' : 'unidades'
            } de ${product.name} agregada${
              finalQuantity === 1 ? '' : 's'
            } al carrito`;

      toast.success(message, {
        duration: 3000,
      });

      // Ejecutar callback de éxito si existe
      onSuccess?.();
    } catch (error) {
      // Si hay un error, mostrar mensaje de error
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al agregar el producto al carrito');
      }
    } finally {
      // Siempre desactivar el estado de carga, incluso si hay error
      setIsAdding(false);
    }
  };

  return {
    handleAddToCart,
    isAdding,
    isOutOfStock,
  };
}

