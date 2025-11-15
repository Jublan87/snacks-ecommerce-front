import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

interface UseCartActionsOptions {
  /**
   * Si es true, muestra toasts al eliminar items o cuando hay errores
   * @default false
   */
  showToasts?: boolean;
}

/**
 * Hook personalizado para acciones del carrito
 *
 * Centraliza los handlers de acciones (cambiar cantidad, eliminar items)
 * para evitar duplicación entre componentes.
 *
 * @param options Opciones de configuración
 * @returns Objeto con funciones de acción
 */
export function useCartActions(options: UseCartActionsOptions = {}) {
  const { showToasts = false } = options;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  /**
   * Cambia la cantidad de un item en el carrito
   * @param itemId ID del item a actualizar
   * @param newQuantity Nueva cantidad
   */
  const handleQuantityChange = (itemId: string, newQuantity: number): void => {
    try {
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      if (error instanceof Error) {
        if (showToasts) {
          toast.error(error.message);
        } else {
          console.error(error.message);
        }
      }
    }
  };

  /**
   * Elimina un item del carrito
   * @param itemId ID del item a eliminar
   */
  const handleRemoveItem = (itemId: string): void => {
    removeItem(itemId);
    if (showToasts) {
      toast.success('Producto eliminado del carrito');
    }
  };

  return {
    handleQuantityChange,
    handleRemoveItem,
  };
}
