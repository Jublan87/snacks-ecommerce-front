import { useCartStore } from '@features/cart/store/cart-store';
import { toast } from 'sonner';

interface UseCartActionsOptions {
  /**
   * Si es true, muestra toasts al eliminar items o cuando hay errores.
   * @default false
   */
  showToasts?: boolean;
}

/**
 * Hook personalizado para acciones del carrito.
 *
 * Centraliza los handlers de acciones (cambiar cantidad, eliminar items)
 * para evitar duplicación entre componentes.
 * Maneja los errores de las operaciones asíncronas del store.
 */
export function useCartActions(options: UseCartActionsOptions = {}) {
  const { showToasts = false } = options;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  /**
   * Cambia la cantidad de un item en el carrito.
   * @param itemId ID del item a actualizar
   * @param newQuantity Nueva cantidad (si es 0 o menor, elimina el item)
   */
  const handleQuantityChange = async (itemId: string, newQuantity: number): Promise<void> => {
    try {
      await updateQuantity(itemId, newQuantity);
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
   * Elimina un item del carrito.
   * @param itemId ID del item a eliminar
   */
  const handleRemoveItem = async (itemId: string): Promise<void> => {
    try {
      await removeItem(itemId);
      if (showToasts) {
        toast.success('Producto eliminado del carrito');
      }
    } catch (error) {
      if (showToasts) {
        const message = error instanceof Error ? error.message : 'Error al eliminar el producto';
        toast.error(message);
      } else {
        console.error(error);
      }
    }
  };

  return {
    handleQuantityChange,
    handleRemoveItem,
  };
}
